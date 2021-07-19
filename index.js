const QueueTask = {
    task : [],
    onprocess : null,
    next : null,
    config: {
        disableLogs: false
    }, 
    log : (message, logtype = 'info') => {
        const { config } = QueueTask;
        let color = '\x1b[33m%s\x1b[0m';
        if (config.disableLogs) return;
    
        if (logtype === 'error') color = '\x1b[31m%s\x1b[0m';
        if (logtype === 'success') color = '\x1b[32m%s\x1b[0m';
        if (logtype === 'process') color = '\x1b[34m%s\x1b[0m';

        console.log(color, message);
    },
    uuid : () => 'xxxxxxxx-xxxx-5xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }),
    generateId : () => {
        let tempid = {
            id : null
        };

        tempid['id'] = QueueTask.uuid();
        while (QueueTask.isexists(tempid)) {
            tempid['id'] = QueueTask.uuid();
        }
        
        return tempid['id'];
    },

    isexists : (data) => {
     const size = QueueTask.size();
     let isexists = false;
    
     if (QueueTask.onprocess) {
        if (QueueTask.onprocess?.data?.id === data?.id) {
            return true;
        }
     }

     if (QueueTask.next) {
        if (QueueTask.next?.data?.id === data?.id) {
            return true;
        }
     }

     for (let index = 0; index < size; index++) {
         if (QueueTask.task[index]?.data?.id === data?.id) {
             isexists = true;
             break;
         }
         
     }
     

     return isexists;
    },

    work : (configs = null) => {
        const { config, log } = QueueTask;

        if (configs) {
            QueueTask.config = { ...config, ...configs }
        }

        log('queue:work');
        return QueueTask;
    },
    size : () => QueueTask.length,
    isempty : () => QueueTask.size() === 0,
    enqueue : (data, callback) => {  
        data['id'] = data?.id ?? QueueTask.generateId();

        const _data = {
            data,
            callback
        };

        if (!QueueTask.isexists(data)) {
            if (!QueueTask.onprocess) {
                QueueTask.onprocess = _data;
                QueueTask.process();
            } else {
                if (!QueueTask.next) {
                    QueueTask.next = _data;
                } else {
                    QueueTask.task.push(_data);
                }
            }
        } else {
            QueueTask.log(`queue:exists TASK ID [${data?.id}]`)
        }

    },
    process : () => {
        if (QueueTask.onprocess) {
            const { data, callback } = QueueTask.onprocess;
            QueueTask.log(`queue:process TASK ID [${data?.id}]`, 'process');
            Promise.resolve(callback(data)).then(QueueTask.dequeue).catch(e => QueueTask.log(e, 'error'))
        } else {
            QueueTask.log('No task to process');
        }
    },
    dequeue : () => {
        QueueTask.log(`queue:done TASK ID [${QueueTask.onprocess?.data?.id}]`, 'success');
        QueueTask.onprocess = QueueTask.next;
        QueueTask.next = (!QueueTask.isempty()) ? QueueTask.task[0] : null;
        QueueTask.task.shift();
        QueueTask.process();
    }
}
  
module.exports = QueueTask;