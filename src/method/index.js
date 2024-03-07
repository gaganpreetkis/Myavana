import {baseUrlLive} from "../constants/url";

/**without token hit  */
export function FetchPostWithOutToken(url, data) {
    return fetch(`${baseUrlLive}${url}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(res => res.json())
        .then((data) => {
            return data;
        })
        .catch(err => {
            console.log(err);
        })
}
/**
 * 
 * for image file upload
 */
export function FetchPostCloud(url, data) {
    return fetch(`${baseUrlLive}${url}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data'
        },
        body: data
    })
        .then(res => res.json())
        .then((data) => {
            return data;
        })
        .catch(err => {
            console.log(err);
        })
}