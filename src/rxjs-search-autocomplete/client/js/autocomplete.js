(function (global, Rx) {

    const limit = 20;

    // Search Wikipedia for a given term
    function searchWikipedia(term) {
        return fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=query&list=search&prop=info&inprop=url&utf8=&format=json&srlimit=${limit}&srsearch=${term}`)
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => Promise.reject(err));
                }
                return res;
            })
            .then(res => res.json())
            .then(res => res.query.search);
    }

    function main() {
        const $input = document.getElementById('textInput'),
            $results = document.getElementById('results');

        // Get all distinct key up events from the input 
        const keyup$ = Rx.Observable.fromEvent($input, 'keyup');

        // only fire if long enough and distinct
        const keyupNeeded$ = keyup$
            .map(e => e.target.value) // Project the text from the input
            .filter(text => text.length > 2) // Only if the text is longer than 2 characters
            .debounceTime(750) // Pause for 750ms
            .distinctUntilChanged(); // Only if the value has changed

        const searcher$ = keyupNeeded$.switchMap(searchWikipedia);

        searcher$.subscribe(data => {
            $results.innerHTML = '';
            console.log('data', data);

            // $results.append($.map(data[1], function (v) { return $('<li>').text(v); }));
        }, error => {
            $results.innerHTML = '';
            console.error(error);

            // $results.append($('<li>').text('Error:' + error));
        });
    }

    document.addEventListener('DOMContentLoaded', main);

}(window, Rx));