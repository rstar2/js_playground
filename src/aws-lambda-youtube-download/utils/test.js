const createPromise = (data) => {
    const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
    return promise.then((i) => {
        console.log('Finished', data);
        if (i < 5)
            return createPromise(++i);

        return i + '!';

    });
}

createPromise(1)
    .then((data) => console.log('Finished all', data));