const BigNumber = require("bignumber.js");
const Token = artifacts.require('./Token.sol');

const SupportedContract = artifacts.require("./support-for-contracts/SupportedContract.sol");
const NotSupportedContract = artifacts.require("./support-for-contracts/NotSupportedContract.sol");

contract('supported contract', async(accounts) => {
    it('Check supported contracts', async()=>{
        let tokenContract = await Token.deployed();
        let supportedContract = await SupportedContract.deployed();
        let notSupportedContract = await NotSupportedContract.deployed();

        // make tokens transferable

        await tokenContract.enableTransfers();

        // transfer some tokens to account 2 and 3 before running tests

        const amountToTransfer = (new BigNumber(500)).times((new BigNumber(10).pow(new BigNumber(18))));
        await tokenContract.transfer(accounts[1], web3.utils.toBN(amountToTransfer));
        await tokenContract.transfer(accounts[2], web3.utils.toBN(amountToTransfer));
        
        // transfer to a supported contract
        // 1. transfer

        await tokenContract.transferHasSupportFor(supportedContract.address, web3.utils.toBN(amountToTransfer), web3.utils.asciiToHex(""), {from: accounts[1]});
        let amtInContract = await tokenContract.balanceOf.call(supportedContract.address);
        let amtInAddress = await tokenContract.balanceOf.call(accounts[1]);

        assert.strictEqual(amountToTransfer.toString(), (new BigNumber(amtInContract)).toString(), "transferHasSupportFor: Amount incorrect");
        assert.strictEqual("0", (new BigNumber(amtInAddress)).toString(), "transferHasSupportFor: incorrect address balance");

        // 2. signed transfer
        // refer to bulk transfer tests
        
        // let from = accounts[2];
        // let to = accounts[3];
        
        // let feeAccount = accounts[5];
        // let nonce = await tokenContract.getNextNonce.call(accounts[2]);
        // let fee = (new BigNumber(5)).times((new BigNumber(10).pow(new BigNumber(18))));
        // let hash = await tokenContract.signedTransferHash.call(from, to, amountToTransfer.toString(), fee.toString(), web3.utils.toBN(nonce));
        // let signedHash = await web3.eth.sign(hash, accounts[2]);

        // await tokenContract.signedTransferHasSupportFor(from, to, amountToTransfer.toString(), fee.toString(), nonce.toNumber(), signedHash, feeAccount, {from: accounts[5]});
        
        // // check balances after signed transfer
        // let nb1 = await tokenContract.balanceOf.call(accounts[2]);
        // let nb2 = await tokenContract.balanceOf.call(accounts[3]);
        // let nb3 = await tokenContract.balanceOf.call(accounts[5]);

        // console.log(nb1.toString());

        // assert.strictEqual(nb1.toFixed(), totalSupply.minus(amount).minus(fee).toString(), "Invalid acc 1 balance");
        // assert.strictEqual(nb2.toFixed(), amount.toString(), "Invalid acc 2 balance");
        // assert.strictEqual(nb3.toFixed(), fee.toString(), "Invalid acc 3 balance");
    });
});