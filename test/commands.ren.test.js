const RenCommand = require("../src/commands/ren/index");
const Environment = require("../src/environment");
const fs = require("fs");
const path = require("path");

const { expect } = require("chai");

const folder = __dirname;

let env = new Environment(path.join(folder, "./files"), {});
let cmd = new RenCommand(env);

describe("RenCommand", () => {
    beforeEach(() => {
        fs.writeFileSync(path.join(folder, "./files/ren.txt"), "delete.me", "utf8");
        fs.writeFileSync(path.join(folder, "./files/ren3.txt"), "delete.me", "utf8");
    });

    afterEach(() => {
        if (fs.existsSync(path.join(folder, "./files/ren.txt")))
            fs.unlinkSync(path.join(folder, "./files/ren.txt"));
        if (fs.existsSync(path.join(folder, "./files/ren2.txt")))
            fs.unlinkSync(path.join(folder, "./files/ren2.txt"));
        if (fs.existsSync(path.join(folder, "./files/ren3.txt")))
            fs.unlinkSync(path.join(folder, "./files/ren3.txt"));
    });

    it("ren should fail if file not exists", async () => {
        let error = null;
        try {
            await cmd.run(["non-existing.xyz", "existing.xyz"]);
        }
        catch (err) {
            error = err;
        }
        expect(error).to.not.be.null;
    });

    it("ren should NOT fail if file not exists with skip", async () => {
        const code = await cmd.run(["non-existing.xyz", "existing.xyz", "--skip-unexisting"]);
        expect(code).to.equals(0);
    });

    it("ren should do nothing with same origin", async () => {
        await cmd.run(["ren.txt", "ren.txt"]);
    });

    it("ren with override should work fine", async () => {
        expect(fs.existsSync(path.join(folder, "./files/ren.txt"))).to.be.true;
        expect(fs.existsSync(path.join(folder, "./files/ren3.txt"))).to.be.true;

        await cmd.run(["ren.txt", "ren3.txt", "-w"]);

        expect(fs.existsSync(path.join(folder, "./files/ren.txt"))).to.be.false;
        expect(fs.existsSync(path.join(folder, "./files/ren3.txt"))).to.be.true;
    });

    it("ren without override should fail", async () => {
        expect(fs.existsSync(path.join(folder, "./files/ren.txt"))).to.be.true;
        expect(fs.existsSync(path.join(folder, "./files/ren3.txt"))).to.be.true;
        let error = null;

        try {
            await cmd.run(["ren.txt", "ren3.txt"]);
        }
        catch (err) {
            error = err;
        }

        expect(error).to.not.be.null;
        expect(fs.existsSync(path.join(folder, "./files/ren.txt"))).to.be.true;
        expect(fs.existsSync(path.join(folder, "./files/ren3.txt"))).to.be.true;
    });

    it("ren should work fine", async () => {
        expect(fs.existsSync(path.join(folder, "./files/ren.txt"))).to.be.true;
        expect(fs.existsSync(path.join(folder, "./files/ren2.txt"))).to.be.false;

        await cmd.run(["ren.txt", "ren2.txt"]);

        expect(fs.existsSync(path.join(folder, "./files/ren.txt"))).to.be.false;
        expect(fs.existsSync(path.join(folder, "./files/ren2.txt"))).to.be.true;
    });
});