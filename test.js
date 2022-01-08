
const loop = () => {
    for (let i = 0; i < 10; i++) {
        yourFunc(i)
    }
}

const yourFunc = async (element) => {
    return new Promise((resolve) => {
        setTimeout(function () {
            console.log(element)
            resolve("done")
        }, (0.5 + Math.random()) * 1000);
    });
}



loop()

