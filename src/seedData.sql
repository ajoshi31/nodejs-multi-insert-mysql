CREATE TABLE Product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(255),
    instock_quantity INT,
    price DECIMAL(8, 2)
);

INSERT INTO Product VALUES (1, "Apple MacBook Pro", "15 inch, i7, 16GB RAM", 5, 667.00);