export {request}

function request(method, url, body, headers) {

    body    = !!body ? body : {};
    headers = !!headers ? headers : {};

    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        Object.keys(headers).forEach(header => xhr.setRequestHeader(header, headers[header]));
        xhr.send(JSON.stringify(body));

        xhr.onreadystatechange = processRequest;

        function processRequest(e) {

            if (xhr.readyState === 4) {
                let response = JSON.parse(xhr.responseText);

                xhr.status === 200 ? resolve(response) : reject(xhr.status);

            }
        }
    });
}