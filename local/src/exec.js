import { spawn } from 'child_process';

export default function exec(data, feed) {
    const { ezs } = this;
    const command = []
        .concat(this.getParam('command'))
        .filter(Boolean)
        .shift();
    const args = []
        .concat(this.getParam('args'))
        .filter(Boolean);

    if (!this.input) {
        const child = spawn(
            command,
            args,
            {
                stdio: ['pipe', 'pipe', process.stderr],
                detached: false,
            },
        );
        const output = child.stdout.pipe(ezs('unpack'));
        child.on('error', (err) => feed.stop(err));
        child.on('exit', () => output.end());
        this.input = ezs.createStream(ezs.objectMode());
        this.input.pipe(ezs('pack')).pipe(child.stdin);
        this.whenFinish = feed.flow(output);
    }
    if (this.isLast()) {
        this.whenFinish.finally(() => feed.close());
        return this.input.end();
    }
    return ezs.writeTo(this.input, data, () => feed.end());
}
