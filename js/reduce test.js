'use strict'

/*for tag names*/
let bigArray = [
    {
        Name: 'Trump',
        children: [
            { Name: 'TrumpChild1', City: 'city1' },
            { Name: 'TrumpChild2', City: 'city2' }
        ]
    },
    {
        Name: 'Barack Obama',
        children: [
            { Name: 'Barack Obama Child1', City: 'city3' },
            { Name: 'Barack Obama Child2', City: 'city4' }
        ]
    },
    {
        Name: 'Clinton',
        children: [
            { Name: 'Clinton Child 1', City: 'city5' },
            { Name: 'Clinton Child2', City: 'city6' }
        ]
    }
];

let all = bigArray.reduce((prev, next) => prev.concat(next.children), []);
let result = all.find(obj => obj.City === 'city1');
console.log(result);

// if there can be multiple matches then use filter
let results = all.filter(obj => obj.City === 'city1');
console.log(results);