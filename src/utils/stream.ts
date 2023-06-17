export function createStreamPusher() {
    const stream = {
        value: '',
        done: false,
    }

    function push(str: BufferSource) {
        stream.value += new TextDecoder().decode(str);
    }


    function getLines(done: boolean) {
        let currentStream = ''
        if (done) {
            currentStream = stream.value;
            stream.value  = '';
        } else {
            const latestBreakIndex = stream.value.lastIndexOf('\n');
            currentStream = stream.value.substring(0, latestBreakIndex)
            stream.value = stream.value.substring(latestBreakIndex);
        }

        return currentStream.split('\n').filter(Boolean)
    }

    function hasValue() {
        return stream.value !== '';
    }

    return {
        push,
        getLines,
        hasValue
    }
}
