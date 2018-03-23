export {
    forward
};

function forward() {

    if (
        window.location.origin.indexOf('localhost') === -1 &&
        window.location.protocol !== 'https:'
    ) {

        window.location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
}