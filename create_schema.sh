rm create_schema.sql
echo "DROP DATABASE IF EXISTS OinkerDB;" >> "create_schema.sql"
echo "CREATE DATABASE OinkerDB;" >> "create_schema.sql"
echo "USE OinkerDB;" >> "create_schema.sql"
echo "CREATE TABLE icons( icon_id INT, PRIMARY KEY(icon_id), icon_blob_data MEDIUMBLOB );" >> "create_schema.sql"
echo "CREATE TABLE users( username_hash VARBINARY(64), PRIMARY KEY( username_hash ), password_hash VARBINARY(64), icon_id INT, FOREIGN KEY(icon_id) REFERENCES icons(icon_id), username_plaintext VARCHAR(256), nym VARCHAR(256 ) );" >> "create_schema.sql"
echo "CREATE TABLE oinks( oink_id INT, PRIMARY KEY(oink_id), username_hash VARBINARY(64), FOREIGN KEY (username_hash) REFERENCES users(username_hash), username_plaintext VARCHAR(256), text_contnet TEXT, icon_id INT, FOREIGN KEY (icon_id) REFERENCES icons(icon_id), timestamp TIMESTAMP );" >> "create_schema.sql"
echo "CREATE USER IF NOT EXISTS 'Oinker_User'@'localhost' IDENTIFIED BY 'Oinker_Password';" >> "create_schema.sql"
echo "GRANT ALL ON OinkerDB.* TO 'Oinker_User'@'localhost';" >> "create_schema.sql"

echo "DELIMITER %%" >> create_schema.sql
echo "CREATE FUNCTION OinkerDB.generate_new_id( in_sequence_id TINYINT )" >> create_schema.sql
echo "RETURNS BIGINT" >> create_schema.sql
echo "NOT DETERMINISTIC" >> create_schema.sql
echo "CONTAINS SQL" >> create_schema.sql
echo "READS SQL DATA" >> create_schema.sql
echo "BEGIN" >> create_schema.sql
echo "DECLARE RetiredID BIGINT;" >> create_schema.sql
echo "DECLARE LastID BIGINT;" >> create_schema.sql
echo "SET @RetiredID = (SELECT retired_id FROM sequence_retired WHERE sequence_id = in_sequence_id LIMIT 1);" >> create_schema.sql
echo "SET @LastID = (SELECT last FROM sequence_last WHERE sequence_id = in_sequence_id LIMIT 1);" >> create_schema.sql
echo "IF @RetiredID IS NULL THEN UPDATE sequence_last SET last = last + 1 WHERE sequence_id = in_sequence_id;" >> create_schema.sql
echo "ELSE DELETE FROM sequence_retired WHERE retired_id = @RetiredID AND sequence_id = in_sequence_id;" >> create_schema.sql
echo "END IF;" >> create_schema.sql
echo "SET @NewID = COALESCE( @RetiredID, @LastID );" >> create_schema.sql
echo "RETURN @NewID;" >> create_schema.sql
echo "END" >> create_schema.sql
echo "%%" >> create_schema.sql
echo "DELIMITER ;" >> create_schema.sql
