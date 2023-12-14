Script para criar o banco no MySQL para c
CREATE DATABASE IF NOT EXISTS SuinoCulturaTheo;

USE SuinoCulturaTheo;

CREATE TABLE IF NOT EXISTS entradaracao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidadeRacao INT,
    validadeRacao DATE,
    data DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS distribuicaomatrizes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS distribuicaobercario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS distribuicaomachos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT,
    data DATETIME DEFAULT CURRENT_TIMESTAMP
);distribuicaobercarioquantidadedata

CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT
);
