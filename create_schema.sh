rm create_schema.sql
echo "DROP DATABASE IF EXISTS OinkerDB;" >> "create_schema.sql"
echo "CREATE DATABASE OinkerDB;" >> "create_schema.sql"
echo "USE OinkerDB;" >> "create_schema.sql"
echo "CREATE TABLE icons( icon_id INT, PRIMARY KEY(icon_id), icon_blob_data MEDIUMBLOB );" >> "create_schema.sql"
echo "CREATE TABLE users( username_hash VARBINARY(64), PRIMARY KEY( username_hash ), password_hash VARBINARY(64), icon_id INT, FOREIGN KEY(icon_id) REFERENCES icons(icon_id), username_plaintext VARCHAR(256), nym VARCHAR(256 ) );" >> "create_schema.sql"
echo "CREATE TABLE oinks( oink_id INT, PRIMARY KEY(oink_id), username_hash VARBINARY(64), FOREIGN KEY (username_hash) REFERENCES users(username_hash), username_plaintext VARCHAR(256), text_contnet TEXT, icon_id INT, FOREIGN KEY (icon_id) REFERENCES icons(icon_id), timestamp TIMESTAMP );" >> "create_schema.sql"
echo "CREATE USER IF NOT EXISTS 'Oinker_User'@'localhost' IDENTIFIED BY 'Oinker_Password';" >> "create_schema.sql"
echo "GRANT ALL ON OinkerDB.* TO 'Oinker_User'@'localhost';" >> "create_schema.sql"
