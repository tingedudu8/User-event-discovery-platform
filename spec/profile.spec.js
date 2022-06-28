require('es6-promise').polyfill();
require('isomorphic-fetch')

const url = path => `http://localhost:3000${path}`;

describe('Validate Registration and Login functionality', () => {
    let testname = 'pc' + (new Date().getTime()).toString()
    it('register new user', (done) => {
        let regUser = {
            username: testname,
            password: '1234',
            email: "pc666@rice.edu",
            zipcode: "12555",
            dob: "128999122000"
        };
        fetch(url('/register'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(regUser)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual(testname);
            expect(res.result).toEqual('success');
            done();
        });
    });

    it('login user', (done) => {
        let loginUser = {username: testname, password: '1234'};
        fetch(url('/login'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginUser)
        }).then(res => {
            return res.json()
        }).then(res => {
            expect(res.username).toEqual(testname);
            expect(res.result).toEqual('success');
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


describe('Validate Headline functionality', () => {
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

    it('put headline', (done) => {
        let post = {headline: "Busy!"};
        fetch(url('/headline'), {
            method: 'PUT',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
            body: JSON.stringify(post)
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual("Bret");
            expect(res.headline).toEqual("Busy!");
            done();
        });
    });

    it('get headline', (done) => {
        fetch(url('/headline'), {
            method: 'GET',
            headers: {'Content-Type': 'application/json', 'cookie': cookie},
        }).then(res => res.json()).then(res => {
            expect(res.username).toEqual("Bret");
            expect(res.headline).toEqual("Busy!");
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