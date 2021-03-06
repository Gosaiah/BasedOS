///<reference path="shellCommand.ts" />
///<reference path="userCommand.ts" />
///<reference path="../utils.ts" />
/* ------------
Shell.ts
The OS Shell - The "command line interface" (CLI) for the console.
------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    var Shell = (function () {
        function Shell() {
            // Properties
            this.promptStr = ">";
            this.commandList = [];
            this.curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
            this.apologies = "[sorry]";
        }
        Shell.prototype.init = function () {
            var sc = null;

            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;

            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;

            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying hardware simulation running.");
            this.commandList[this.commandList.length] = sc;

            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;

            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;

            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;

            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;

            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            
            // DATE GOES HERE
            sc = new TSOS.ShellCommand(this.shellDate, "Date", "<string> - Displays the date & time.");
            this.commandList[this.commandList.length] = sc;
            
            
            //WHERE AM I
            sc = new ShellCommand(this.shellWhereAmI, "Where Am I","- Displays your location.");
			this.commandList[this.commandList.length] = sc;

            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Updates the Status");
            this.commandList[this.commandList.length] = sc;

            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the date and time.");
            this.commandList[this.commandList.length] = sc;

            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays the location.");
            this.commandList[this.commandList.length] = sc;

            // Cake is a Lie?
            sc = new TSOS.ShellCommand(this.shellPortal, "portal", "- Displays if the cake is in fact a lie..");
            this.commandList[this.commandList.length] = sc;

            // Cause Based blue screen of death
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "- You sure you want to do that? #taskForce will find you!");
            this.commandList[this.commandList.length] = sc;

            // Load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<string> - Allows for #Based Hex code");
            this.commandList[this.commandList.length] = sc;

            // Run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "<processId> - Executes a program in memory");
            this.commandList[this.commandList.length] = sc;

            // Single Step
            sc = new TSOS.ShellCommand(this.shellStep, "step", "<int> - Runs single step mode via the process given (pId)");
            this.commandList[this.commandList.length] = sc;

            // processes - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            //
            // Display the initial prompt.
            this.putPrompt();
        };

        Shell.prototype.putPrompt = function () {
            _StdOut.putText(this.promptStr);
        };

        Shell.prototype.handleInput = function (buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);

            //
            // Parse the input...
            //
            var userCommand = new TSOS.UserCommand();
            userCommand = this.parseInput(buffer);

            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;

            //
            // Determine the command and execute it.
            //
            // JavaScript may not support associative arrays in all browsers so we have to
            // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                } else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args);
            } else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) {
                    this.execute(this.shellCurse);
                } else if (this.apologies.indexOf("[" + cmd + "]") >= 0) {
                    this.execute(this.shellApology);
                } else {
                    this.execute(this.shellInvalidCommand);
                }
            }
        };

        Shell.prototype.getCommands = function () {
            var commands = [];
            for (var i = 0; i < this.commandList.length; i++) {
                commands[i] = this.commandList[i].command;
            }
            return commands;
        };

        // args is an option parameter, ergo the ? which allows TypeScript to understand that
        Shell.prototype.execute = function (fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();

            // ... call the command function passing in the args...
            fn(args);

            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }

            // ... and finally write the prompt again...almost..
            // as long as the canvas isnt filled with black, write the prompt again
            /*if(_DrawingContext.fillStyle != "#000000")
            {
            this.putPrompt();
            }*/
            this.putPrompt();
        };

        Shell.prototype.parseInput = function (buffer) {
            var retVal = new TSOS.UserCommand();

            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);

            // 2. Lower-case it.
            buffer = buffer.toLowerCase();

            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");

            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift();

            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);

            // 4.2 Record it in the return value.
            retVal.command = cmd;

            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        };

        //
        // Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
        //
        Shell.prototype.shellInvalidCommand = function () {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Duh. Go back to your Speak & Spell.");
            } else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        };

        Shell.prototype.shellCurse = function () {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        };

        Shell.prototype.shellApology = function () {
            if (_SarcasticMode) {
                _StdOut.putText("Okay. I forgive you. This time.");
                _SarcasticMode = false;
            } else {
                _StdOut.putText("For what?");
            }
        };

        Shell.prototype.shellVer = function (args) {
            _StdOut.putText(APP_NAME + " myVersion " + APP_VERSION);
        };

        Shell.prototype.shellHelp = function (args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        };

        Shell.prototype.shellShutdown = function (args) {
            _StdOut.putText("Shutting down...");

            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
        };

        Shell.prototype.shellCls = function (args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        };

        Shell.prototype.shellMan = function (args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            } else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        };

        Shell.prototype.shellStatus = function (args) {
            var element = document.getElementById('taStatusBarStatus');
            if (args.length > 0) {
                element.innerHTML = "Status: " + args[0];
            } else {
                _StdOut.putText("Usage: status <string>  Please supply a string");
            }
            /*if(args.length > 0)
            {
            STATUS = args[0];
            }
            else
            {
            _StdOut.putText("Usage: status <string>  Please supply a string");
            }*/
        };

        Shell.prototype.shellDate = function (args) {
            var date, clock, hour, min, mins, period;
            date = new Date();
            clock = date.getHours();
            mins = date.getMinutes();
            min = "";
            period = "AM";
            if (clock == 0) {
                hour = 12;
            } else if (clock > 12) {
                hour = clock - 12;
                period = "PM";
            } else if (clock == 12) {
                hour += clock;
                period = "PM";
            } else {
                hour += clock;
            }

            if (mins < 10) {
                min = "0" + mins; //add the extra 0 for the tens place
            } else {
                min += mins;
            }
            _StdOut.putText(date.toLocaleDateString() + " " + hour + ":" + min + " " + period);
            // var now = new Date();
            //_StdOut.putText(now.getMonth
            //_StdOut.putText("TEMP DATE STRING");
        };

        Shell.prototype.shellWhereAmI = function (args) {
            _StdOut.putText("Forget you! where the heck am i?!?! And why am i still not on FoxNet -_-");
        };

        Shell.prototype.shellPortal = function (args) {
            _StdOut.putText("Actually, the Cake is in fact very real and not a lie at all. Man, i'm hungry >_>");
        };

        Shell.prototype.shellTrace = function (args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, dumbass.");
                        } else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }

                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            } else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        };

        Shell.prototype.shellRot13 = function (args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            } else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        };

        Shell.prototype.shellPrompt = function (args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            } else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        };
<<<<<<< HEAD
        
        Shell.prototype.shellDate = function (args) 
        {
        	var now = new Date();_StdOut.putText(now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds());
        };
            
        Shell.prototype.shellWhereAmI = function (args) 
         {
         	_StdOut.putText("Location received, Deploying Task Force. Stay Positive - Lil B");
         };
         
        Shell.prototype.shellRandomQuote = function (args)
        {
        	_StdOut.putText("Gracias Dios Basado");   
        };
         
=======

        Shell.prototype.shellBsod = function () {
            // Call Kernel trap
            _Kernel.krnTrapError("FakeBased. BasedWorld does not approve -_-");

            //fill canvas with black
            //_DrawingContext.fillStyle = "black";
            //_DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            var element = document.getElementById("display");
            element.style.display = "none";
            var element2 = document.getElementById("divConsole");
            element2.style.backgroundImage = "url('dist/images/basedgod.gif')";
            var element3 = document.getElementById('taStatusBarStatus');
            element3.innerHTML = "Status: " + "THANKYOUBASED GOD";
            _Kernel.krnShutdown();
        };

        Shell.prototype.shellLoad = function (args) {
            //var input = "";
            var input = document.getElementById("taProgramInput");

            //var program, validated, charCheck;
            var program = input.value;
            program = program.trim();
            var memoryString = "";
            var validated = true;

            for (var i = 0; i < program.length; i++) {
                var charCheck = program.charAt(i);
                if (!((charCheck >= 'A' && charCheck <= 'F') || (charCheck >= 'a' && charCheck <= 'f') || (charCheck >= '0' && charCheck <= '9') || charCheck === ' ')) {
                    validated = false;
                } else {
                    if (charCheck !== ' ') {
                        memoryString += program.charAt(i);
                    }
                }
            }
            if (program.length == 0 || program.length % 2 != 0) {
                validated = false;
            }

            if (validated) {
                //_MemoryManager.loadMemory(memoryString);
                _StdOut.putText("Lil B loves you.... program load successful #taskForce.");
            } else {
                _StdOut.putText("Lil B is not pleased. Program Invalid.");
            }
        };
<<<<<<< HEAD
>>>>>>> Test
=======

        Shell.prototype.shellRun = function (pId) {
        };

        Shell.prototype.shellStep = function (pId) {
        };
>>>>>>> Test
        return Shell;
    })();
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
