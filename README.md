# queue-task
Task Queueing - push , wait and process


## Install

```
$ npm install p-queue
```

## Usage

```js
const QueueTask = require('queue-task');

const queue = QueueTask.work();

queue.enqueue({
    id : 1,
    message : 'Hello World'
}, (data) => {
    console.log(`Output: ${data.message}`);
});


// auto generated id
queue.enqueue({message : 'Hello World'}, (data) => new Promise( resolve => {
    setTimeout(() => {
        console.log(data.message);
        resolve();
    }, 1000);
}));

```


## Output

```
queue:work

queue:process TASK ID [1]

Output: Hello World

queue:done TASK ID [1]

queue:process TASK ID [16ade13e-8780-5113-9238-151e45beca60]

Hello World

queue:done TASK ID [16ade13e-8780-5113-9238-151e45beca60]

```

## Queue Method
### .work(config?)
set queue configuration
#### config
Type : `object`

disableLogs
- disable all console logs
Type : `boolean`
Default : false

### .enqueue(data, fn)
adds a task to the queue

#### data
Type : `object`
- it must be an object and contain an optional id key to make the task unique or it will generate a uuid for the given task.
- data to be processed or passed to callback

#### fn
Type: `function`
- the function by which the data can be processed

## Note
- please feel free to contact the [author](mailto:jonreygalera@gmail.com) for bugs and suggestions. Thanks and keep safe!!!!