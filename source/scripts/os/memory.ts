///<reference path="../globals.ts" />

/**
* Isaiah Miller
* Last Updated: 11/5/14
*/
module TSOS
{
	export class Memory
	{
		constructor(public memory: number[] = [])
		{

        }

        public init(): void
        {
            for(var i = 0; i < 1536; i++){
                this.memory[i] = 0;
            }
        }

        public getMemoryBlock(i) : number 
        {
            return this.memory[i];
        }

        public setMemoryBlock(index: number, value : number)
        {
            this.memory[index] = value;
        }

		/*public memory()
		{
			var counter;
			counter = 0;

		}

		public load(daMemory)
		{/*
			_Memory[_MemoryCount] = daMemory;
			_MemoryCount++;
			alert(_Memory);
		}*/
	}
}