require('es6-promise').polyfill();
require('isomorphic-fetch');

const url = path => `http://localhost:3000${path}`;


describe('Validate Article functionality', () => {
    let cookie;
    it('login user', (done) => {
        let loginUser = {username: 'Bret', password: 'cp123'};
        fetch(url('/login'), {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginUser)
        }).then(res => {
            // Set cookies
            cookie = res.headers.get('set-cookie');
            console.log("cookie is ", cookie);
            return res.json()
        }).then(res => {
            expect(res.username).toEqual('Bret');
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('get articles', (done) => {
        fetch(url('/articles'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
        }).then(res => res.json()).then(res => {
            if (res instanceof Array)
                expect(res.length).toBeGreaterThan(2);
            done();
        });
    });

    it('get an article with a specified id', (done) => {
        fetch(url('/articles/6'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
        }).then(res => res.json()).then(res => {
            let resp = res["articles"][0];
            expect(resp["id"]).toBe(6);
            expect(resp["username"]).toBe("Samantha");
            done();
        });
    });

    it('get an article with a specified username', (done) => {
        fetch(url('/articles/Bret'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
        }).then(res => res.json()).then(res => {
            if (res instanceof Array)
                expect(res.length).toBeGreaterThan(2);
            done();
        });
    });

    it('put an article', (done) => {
        let post = {text: "We are Champion"};
        fetch(url('/articles/4'), {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            expect(res["id"]).toBe(4);
            expect(res["body"]).toBe(post.text)
            done();
        });
    });

    it('put a comment', (done) => {
        let post = {text: "COOOOOOOOL", commentId: 1};
        fetch(url('/articles/4'), {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            expect(res["id"]).toBe(4);
            expect(res["comments"][1]["ctext"]).toBe(post.text);
            done();
        });
    });

    it('logout user', (done) => {
        fetch(url('/logout'), {
            method: 'PUT',
        }).then(res => {
            expect(res.status).toEqual(200);
            done();
        });
    });
});