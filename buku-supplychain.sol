// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract buku-supplychian {
    struct Product {
        uint256 id;
        string name;
        string description;
        address owner;
         uint256 quantity;
        string isbn;string penerbit;
    }

    mapping(uint256 => Product) private products;
    uint256 private totalProducts;
    uint256 private lastProductId; // Tambahkan variabel lastProductId

    mapping(address => string) private registeredCompanies;

    event ProductAdded(uint256 id, string name, string description, address owner);
    event ProductTransferred(uint256 id, address from, address to);

    function addProduct(uint256 _id, string memory _name, string memory _description, uint256 _quantity, string memory isbn, string memory penerbit) public returns (uint256) {
        require(_id > 0, "ID harus lebih besar dari 0");
        require(products[_id].owner == address(0), "ID sudah digunakan");
        products[_id] = Product(_id, _name, _description, msg.sender, _quantity, isbn, penerbit);
        lastProductId = _id; // Update lastProductId dengan ID produk baru
        emit ProductAdded(_id, _name, _description, msg.sender);
        return _id;
    }

    function transferProduct(uint256 _id, address _to, uint256 _quantity) public {
        require(products[_id].owner == msg.sender, "Anda tidak berhak");
        require(products[_id].quantity >= _quantity, "Jumlah produk tidak mencukupi");
        products[_id].quantity -= _quantity; // Kurangi jumlah produk pada pemilik asli
        lastProductId++; // Tambahkan ID produk baru
        products[lastProductId] = Product(lastProductId, products[_id].name, products[_id].description, _to, _quantity, products[_id].isbn, products[_id].penerbit); // Tambahkan produk baru dengan ID terakhir
        emit ProductTransferred(lastProductId, msg.sender, _to);                                                      
    }


    function getProduct(uint256 _id) public view returns (uint256 id, string memory name, string memory description, address owner, uint256 quantity, string memory company, string memory isbn, string memory penerbit) {
        Product memory product = products[_id];
        string memory company = registeredCompanies[product.owner];
        return (product.id, product.name, product.description, product.owner, product.quantity, company, product.isbn, product.penerbit);
    }


    function registerCompany(string memory _description) public {
        registeredCompanies[msg.sender] = _description;
    }

    function getRegisteredCompanyDescription(address _addr) public view returns (string memory) {
        return registeredCompanies[_addr];
    }

    
}