const Identity = artifacts.require("Identity");

contract("Identity", (accounts) => {
  // Test 1: Deployment
  it("should deploy the contract successfully", async () => {
    const instance = await Identity.deployed();
    assert(instance.address !== "", "Contract was not deployed successfully");
  });

  // Test 2: Adding a user
  it("should add a new user successfully", async () => {
    const instance = await Identity.deployed();
    await instance.addUser("Alice", "alice@email.com", 1, { from: accounts[0] });
    const user = await instance.getUser({ from: accounts[0] }); // Use getUser function to retrieve user details
    assert.equal(user[0], "Alice", "User name should be Alice");
    assert.equal(user[1], "alice@email.com", "Email should match");
    assert.equal(user[2].toNumber(), 1, "ID should match");
  });

  // Test 3: Prevent duplicate user registration
  it("should not allow duplicate user registration", async () => {
    const instance = await Identity.deployed();
    try {
      await instance.addUser("Bob", "bob@email.com", 2, { from: accounts[0] });
      assert.fail("Duplicate registration should fail");
    } catch (error) {
      assert(error.message.includes("User already registered"), "Error should mention duplicate registration");
    }
  });

  // Test 4: Retrieve user details
  it("should retrieve the correct user details", async () => {
    const instance = await Identity.deployed();
    const user = await instance.getUser({ from: accounts[0] }); // Use getUser function
    assert.equal(user[0], "Alice", "Retrieved user name should match");
    assert.equal(user[1], "alice@email.com", "Retrieved email should match");
    assert.equal(user[2].toNumber(), 1, "Retrieved ID should match");
  });

  // Test 5: Retrieve details for non-registered user
  it("should not allow retrieval for unregistered users", async () => {
    const instance = await Identity.deployed();
    try {
      await instance.getUser({ from: accounts[1] }); // Accounts[1] has not been registered
      assert.fail("Unregistered user should not retrieve data");
    } catch (error) {
      assert(error.message.includes("User not registered"), "Error should mention unregistered user");
    }
  });
});
