SELECTS UPDATEs INSERTs IMPORTANTES{
    select * from entradaracao;
    select * from distribuicaobercario;
    select * from distribuicaomachos;
    select * from distribuicaomatrizes;
    select * from estoque

    ------------------------------------------------------------------------------------------------
    UPDATE
    estoque
    SET
    quantidade = 0
    WHERE
    id = 1;

    INSERT INTO
    estoque (id, quantidade)
    VALUES
    (1, 0);


    ------------------------------------------------------------------------------------------------
    UPDATE
  estoque
SET
  quantidade = quantidade + (
    SELECT
      SUM(quantidadeRacao)
    FROM
      entradaracao
  )
WHERE
  id = 1;
UPDATE
  estoque
SET
  quantidade = quantidade - (
    SELECT
      SUM(quantidade)
    FROM
      distribuicaobercario
  )
WHERE
  id = 1;
UPDATE
  estoque
SET
  quantidade = quantidade - (
    SELECT
      SUM(quantidade)
    FROM
      distribuicaomatrizes
  )
WHERE
  id = 1;
UPDATE
  estoque
SET
  quantidade = quantidade - (
    SELECT
      SUM(quantidade)
    FROM
      distribuicaomachos
  )
WHERE
  id = 1;
SELECT
  *
FROM
  estoque
WHERE
  quantidade IS NOT NULL;

}

!IMPORTANTE PARA CRIAÇÃO DO BANCO DE DADOS MYSQL

CREATE DATABASE IF NOT EXISTS SuinoCulturaTheo;

USE SuinoCulturaTheo;

CREATE TABLE IF NOT EXISTS entradaracao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidadeRacao INT,
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
);

CREATE TABLE IF NOT EXISTS estoque (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quantidade INT
);
