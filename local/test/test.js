import from from 'from';
import ezs from '@ezs/core';
import analytics from '@ezs/analytics';
import statements from '../src';

ezs.addPath(__dirname);
ezs.use(analytics);

describe('exec', () => {
    test('cat', (done) => {
        ezs.use(statements);
        const input = [
            { a: 1, b: 'a' },
            { a: 2, b: 'b' },
            { a: 3, b: 'c' },
            { a: 4, b: 'd' },
            { a: 5, b: 'e' },
            { a: 6, b: 'f' },
        ];
        const output = [];
        const script = `

            [exec]
            command = cat

        `;
        from(input)
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                output.push(chunk);
            })
            .on('end', () => {
                expect(output.length).toEqual(6);
                expect(output[0].b).toEqual('a');
                expect(output[1].b).toEqual('b');
                expect(output[2].b).toEqual('c');
                expect(output[3].b).toEqual('d');
                expect(output[4].b).toEqual('e');
                expect(output[5].b).toEqual('f');
                done();
            });
    });
    test('sort', (done) => {
        ezs.use(statements);
        const input = [
            { a: 1, b: 'a' },
            { a: 2, b: 'b' },
            { a: 3, b: 'c' },
            { a: 4, b: 'd' },
            { a: 5, b: 'e' },
            { a: 6, b: 'f' },
        ];
        const output = [];
        const script = `
            [exec]
            path = b
            command = sort
            args = --reverse
        `;
        from(input)
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                output.push(chunk);
            })
            .on('end', () => {
                done();
                expect(output.length).toEqual(6);
                expect(output[0].b).toEqual('f');
                expect(output[1].b).toEqual('e');
                expect(output[2].b).toEqual('d');
                expect(output[3].b).toEqual('c');
                expect(output[4].b).toEqual('b');
                expect(output[5].b).toEqual('a');
            });
    });
    test('cmd.sh', (done) => {
        ezs.use(statements);
        const input = [
            { a: 1, b: 'a' },
            { a: 2, b: 'b' },
            { a: 3, b: 'c' },
            { a: 4, b: 'd' },
            { a: 5, b: 'e' },
            { a: 6, b: 'f' },
        ];
        const output = [];
        const script = `

            [exec]
            path = b
            command = test/cmd.sh
            [replace]
            path = a
            value = get('A')
            path = b
            value = get('B')

        `;
        from(input)
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                output.push(chunk);
            })
            .on('end', () => {
                expect(output.length).toEqual(6);
                expect(output[0].b).toEqual('A');
                expect(output[1].b).toEqual('B');
                expect(output[2].b).toEqual('C');
                expect(output[3].b).toEqual('D');
                expect(output[4].b).toEqual('E');
                expect(output[5].b).toEqual('F');
                done();
            });
    });
    test('cmd.py', (done) => {
        ezs.use(statements);
        const input = [
            { a: 1, b: 'a' },
            { a: 2, b: 'b' },
            { a: 3, b: 'c' },
            { a: 4, b: 'd' },
            { a: 5, b: 'e' },
            { a: 6, b: 'f' },
        ];
        const output = [];
        const script = `


            [expand]
            path = b
            [expand/exec]
            command = test/cmd.py
        `;
        from(input)
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', done)
            .on('data', (chunk) => {
                output.push(chunk);
            })
            .on('end', () => {
                expect(output.length).toEqual(6);
                expect(output[0].b).toEqual('A');
                expect(output[1].b).toEqual('B');
                expect(output[2].b).toEqual('C');
                expect(output[3].b).toEqual('D');
                expect(output[4].b).toEqual('E');
                expect(output[5].b).toEqual('F');
                done();
            });
    });
    test('nonexisting file', (done) => {
        ezs.use(statements);
        const input = [
            { a: 1, b: 'a' },
            { a: 2, b: 'b' },
            { a: 3, b: 'c' },
            { a: 4, b: 'd' },
            { a: 5, b: 'e' },
            { a: 6, b: 'f' },
        ];
        const script = `

            [exec]
            path = b
            command = xxxxxxxxxxxxx
            [assign]
            path = b
            value = get('b.value')
        `;
        from(input)
            .pipe(ezs('delegate', { script }))
            .pipe(ezs.catch())
            .on('error', () => {
                done();
            })
            .on('end', () => {
                done(new Error('Error is the right behavior'));
            });
    });
});
