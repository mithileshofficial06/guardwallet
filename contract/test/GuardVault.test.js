const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("GuardVault", function () {
  let guardVault;
  let usdc;
  let owner, user1, trusted1, trusted2;

  beforeEach(async function () {
    [owner, user1, trusted1, trusted2] = await ethers.getSigners();

    // Deploy mock USDC
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    usdc = await MockERC20.deploy("Mock USDC", "USDC");

    // Deploy GuardVault
    const GuardVault = await ethers.getContractFactory("GuardVault");
    guardVault = await GuardVault.deploy(usdc.address, ethers.constants.AddressZero);

    // Mint USDC to user
    await usdc.mint(user1.address, ethers.utils.parseEther("10000"));
  });

  it("Should create a vault", async function () {
    await guardVault.connect(user1).createVault(
      [trusted1.address, trusted2.address],
      2,
      ethers.utils.parseEther("500")
    );

    const vault = await guardVault.vaults(user1.address);
    expect(vault.isActive).to.equal(true);
    expect(vault.survivalMinimum).to.equal(ethers.utils.parseEther("500"));
  });

  it("Should deposit and protect funds", async function () {
    await guardVault.connect(user1).createVault(
      [trusted1.address],
      1,
      ethers.utils.parseEther("500")
    );

    await usdc.connect(user1).approve(guardVault.address, ethers.utils.parseEther("1000"));
    await guardVault.connect(user1).depositAndProtect(
      ethers.utils.parseEther("1000"),
      ethers.utils.parseEther("600")
    );

    const vault = await guardVault.vaults(user1.address);
    expect(vault.protectedBalance).to.equal(ethers.utils.parseEther("600"));
    expect(vault.availableBalance).to.equal(ethers.utils.parseEther("400"));
  });

  it("Should calculate daily budget correctly", async function () {
    await guardVault.connect(user1).createVault(
      [trusted1.address],
      1,
      ethers.utils.parseEther("500")
    );

    await usdc.connect(user1).approve(guardVault.address, ethers.utils.parseEther("1000"));
    await guardVallet.connect(user1).depositAndProtect(
      ethers.utils.parseEther("1000"),
      ethers.utils.parseEther("600")
    );

    const [dailyBudget, daysRemaining] = await guardVault.calculateDailyBudget(user1.address);
    expect(dailyBudget).to.be.gt(0);
  });
});
