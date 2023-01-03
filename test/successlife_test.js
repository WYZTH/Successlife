const {
    time,
    loadFixture,
} = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers, waffle } = require("hardhat");

describe("Success Life", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshopt in every test.
    async function deployState() {
        // Contracts are deployed using the first signer/account by default
        const [deployer, account2, account3, account4, account5, account6] = await ethers.getSigners();

        const GLDToken = await ethers.getContractFactory("GLDToken");
        const gldToken = await GLDToken.deploy("1000000000000000000000000");

        const SuccessLife = await ethers.getContractFactory("SuccessLife");
        const successLife = await SuccessLife.deploy(deployer.address, gldToken.address);

        return { gldToken, successLife, deployer, account2, account3, account4, account5, account6 };
    }

    describe("Success Life", function () {
        it("Should register a user and split payment", async function () {
            const { gldToken, successLife, deployer, account2 } = await loadFixture(
                deployState
            );
            await gldToken.transfer(account2.address, "10000000000000000000");
            await gldToken.connect(account2).approve(successLife.address, "10000000000000000000");
            await successLife.connect(account2).regUser(1);
            expect(await gldToken.balanceOf(successLife.address)).to.equal(0);
            expect(await gldToken.balanceOf(deployer.address)).to.equal("1000000000000000000000000");
            let userInfo = await successLife.users(account2.address);
            let referrals = await successLife.viewUserReferrals(deployer.address);
            expect(account2.address).to.equal(referrals[0]);
        })
        it("Should register multiple user and split payment", async function () {
            const { gldToken, successLife, deployer, account2, account3, account4, account5 } = await loadFixture(
                deployState
            );
            await gldToken.transfer(account2.address, "10000000000000000000");
            await gldToken.transfer(account3.address, "10000000000000000000");
            await gldToken.transfer(account4.address, "30000000000000000000");
            await gldToken.transfer(account5.address, "10000000000000000000");

            await gldToken.connect(account2).approve(successLife.address, "10000000000000000000");
            await gldToken.connect(account3).approve(successLife.address, "10000000000000000000");
            await gldToken.connect(account4).approve(successLife.address, "30000000000000000000");
            await gldToken.connect(account5).approve(successLife.address, "10000000000000000000");

            await successLife.connect(account2).regUser(1);
            await successLife.connect(account3).regUser(1);
            await successLife.connect(account4).regUser(1);
            await successLife.connect(account5).regUser(1);

            console.log(await successLife.users(deployer.address));
            await successLife.connect(account4).buyLevel(2);

            expect(await gldToken.balanceOf(successLife.address)).to.equal(0);
            expect(await gldToken.balanceOf(deployer.address)).to.equal("1000000000000000000000000")
        })
        it("Should register multiple user and refer different referrals", async function () {
            const { gldToken, successLife, deployer, account2, account3, account4, account5, account6 } = await loadFixture(
                deployState
            );
            await gldToken.transfer(account2.address, "30000000000000000000");
            await gldToken.transfer(account3.address, "10000000000000000000");
            await gldToken.transfer(account4.address, "30000000000000000000");
            await gldToken.transfer(account5.address, "10000000000000000000");
            await gldToken.transfer(account6.address, "10000000000000000000");

            await gldToken.connect(account2).approve(successLife.address, "30000000000000000000");
            await gldToken.connect(account3).approve(successLife.address, "10000000000000000000");
            await gldToken.connect(account4).approve(successLife.address, "30000000000000000000");
            await gldToken.connect(account5).approve(successLife.address, "10000000000000000000");
            await gldToken.connect(account6).approve(successLife.address, "10000000000000000000");

            await successLife.connect(account2).regUser(1);
            await successLife.connect(account3).regUser(1);
            await successLife.connect(account4).regUser(2);
            await successLife.connect(account5).regUser(2);
            await successLife.connect(account6).regUser(2);

            console.log(await successLife.users(account2.address));
            await successLife.connect(account2).buyLevel(2);
            await successLife.connect(account4).buyLevel(2);

            console.log(await gldToken.balanceOf(account2.address));
            expect(await gldToken.balanceOf(successLife.address)).to.equal(0);
            expect(await gldToken.balanceOf(deployer.address)).to.equal("999960000000000000000000")
        })
    });
});