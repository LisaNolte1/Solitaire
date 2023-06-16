DELIMITER //

CREATE PROCEDURE InsertUser (
  IN p_Username VARCHAR(50),
  IN p_Email VARCHAR(100),
  IN p_HashedPassword VARCHAR(255),
  IN p_Salt VARCHAR(255)
)
BEGIN
  -- Declare a variable for the new UserID
  DECLARE newUserID INT;

  -- Insert the user into the User table
  INSERT INTO User (Username, Email)
  VALUES (p_Username, p_Email);

  -- Retrieve the auto-generated UserID of the newly inserted user
  SET newUserID = LAST_INSERT_ID();

  -- Insert the password into the Password table
  INSERT INTO Password (UserID, HashedPassword, Salt)
  VALUES (newUserID, p_HashedPassword, p_Salt);
END //

DELIMITER ;