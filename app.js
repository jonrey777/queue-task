const QueueTask = require('./index');

const q = QueueTask.work();

q.enqueue({message : 'hi'}, (data) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('1',data.id)
        resolve('hey')
    }, 5000)
}));


q.enqueue({message : 'hello'}, (data) => new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('2',data.id)
        resolve('done')
    }, 1000)
}));


q.enqueue({message : 'hello'}, (data) => {
    console.log('3', data.id)
});

q.enqueue({message : '1'}, console.log)

console.log('main')
console.log('main-v2')