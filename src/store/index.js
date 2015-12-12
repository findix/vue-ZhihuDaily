// import Firebase from 'firebase';
import {
    EventEmitter
}
from 'events';
import {
    Promise
}
from 'es6-promise';

// const api = new Firebase('https://hacker-news.firebaseio.com/v0');
const host = 'http://localhost:9090';
const itemsCache = Object.create(null);
const store = new EventEmitter();
const storiesPerPage = store.storiesPerPage = 30;

// let topStoryIds = [];
let date;
let stories = [];

export default store;

var getURL = function(URL) {
    return new Promise(function(resolve, reject) {
        var req = new XMLHttpRequest();
        req.open('GET', URL, true);
        req.onload = function() {
            if (req.status === 200) {
                resolve(req.responseText);
            } else {
                reject(new Error(req.statusText));
            }
        };
        req.onerror = function() {
            reject(new Error(req.statusText));
        };
        req.send();
    });
};

/**
 * Subscribe to real time updates of the top 100 stories,
 * and cache the IDs locally.
 */

// api.child('topstories').on('value', snapshot => {
//     topStoryIds = snapshot.val();
//     store.emit('topstories-updated');
// });

var updateData = function() {
    getURL(host + '/api/4/news/latest')
        .then(function(resolve) {
            const jsonObj = JSON.parse(resolve);
            date = jsonObj.date;
            stories = jsonObj.stories;
            console.log('emited');
            store.emit('topstories-updated');
        });
};

updateData();
setTimeout(function() {
    store.emit('topstories-updated');
}, 250);

/**
 * Fetch an item data with given id.
 *
 * @param {Number} id
 * @return {Promise}
 */

// store.fetchItem = id => {
//     return new Promise((resolve, reject) => {
//         if (itemsCache[id]) {
//             resolve(itemsCache[id]);
//         } else {
//             api.child('item/' + id).once('value', snapshot => {
//                 const story = itemsCache[id] = snapshot.val();
//                 resolve(story);
//             }, reject);
//         }
//     });
// };

store.fetchItem = id => {
    return new Promise((resolve, reject) => {
        if (itemsCache[id]) {
            resolve(itemsCache[id]);
        } else {
            getURL(host + '/api/4/news/' + id)
                .then(function(resolve) {
                    const story = itemsCache[id] = JSON.parse(resolve);
                    resolve(story);
                }, reject);
        }
    });
};

/**
 * Fetch the given list of items.
 *
 * @param {Array<Number>} ids
 * @return {Promise}
 */

// store.fetchItems = ids => {
//     if (!ids || !ids.length) {
//         return Promise.resolve([]);
//     } else {
//         return Promise.all(ids.map(id => store.fetchItem(id)));
//     }
// };

/**
 * Fetch items for the given page.
 *
 * @param {Number} page
 * @return {Promise}
 */

// store.fetchItemsByPage = page => {
//     const start = (page - 1) * storiesPerPage;
//     const end = page * storiesPerPage;
//     const ids = topStoryIds.slice(start, end);
//     return store.fetchItems(ids);
// };

// store.fetchItemsByPage = page => {
//     const start = (page - 1) * storiesPerPage;
//     const end = page * storiesPerPage;
//     const ids = stories.map(store => store.id).slice(start, end);
//     return store.fetchItems(ids);
// };

store.fetchItemsAll = () => {
    const ids = stories.map(store => store.id);
    if (!ids || !ids.length) {
        return Promise.resolve([]);
    } else {
        return Promise.all(ids.map(id => store.fetchItem(id)));
    }
};

/**
 * Fetch a user data with given id.
 *
 * @param {Number} id
 * @return {Promise}
 */

store.fetchUser = id => {
    return new Promise((resolve, reject) => {
        api.child('user/' + id).once('value', snapshot => {
            resolve(snapshot.val());
        }, reject);
    });
};
