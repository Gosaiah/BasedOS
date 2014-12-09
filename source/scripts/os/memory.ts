///<reference path="../globals.ts" />

/**
* Isaiah Miller
* Last Updated: 11/20/14
*/
module TSOS
{
	export class Memory
	{
		//static fromOtherPoint(point:Point):Point {
		constructor(public memory: number[] = [])
		{

        }
        //private memory = [];

        //memory = memory;

        public init(): void
        {
            for(var i = 0; i < 768; i++)
            {
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