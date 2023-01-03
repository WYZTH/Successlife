function enterRoyalMatrix(uint256 _level) external isLocked {
        require(
            users[msg.sender].currentLevel == 4,
            "Enter silver matrix after level 4"
        );

        require(
            (_level >= 1) &&
                (_level <= 2) &&
                (globalMatrixCurrentLevel[msg.sender][royalMatrixID] + 1 == _level),
            "Incorrect Level"
        );

        IERC20(BUSD).transferFrom(msg.sender, address(this), 30 * 1E18);

        globalMatrixIncrement[royalMatrixID]++;

        globalMatrixuserID[msg.sender][royalMatrixID] = globalMatrixIncrement[royalMatrixID];

        globalMatrixCurrentLevel[msg.sender][royalMatrixID] = _level;

        globalmartixUseraddress[royalMatrixID][globalMatrixIncrement[royalMatrixID]] = msg.sender;

        uint256 uplineID = 1;
        if (globalMatrixReferrals[uplineID][1].length >= 3)
            uplineID = globalMatrixuserID[
                findFreeReferrerForGlobalMatrix(globalmartixUseraddress[royalMatrixID][1])
            ][1];

        globalMatrixReferrals[uplineID][royalMatrixID].push(msg.sender);
        globalMatrixUserUpline[msg.sender][royalMatrixID] = uplineID;

        if (_level == 1) {
            IERC20(BUSD).transfer(
                globalmartixUseraddress[royalMatrixID][uplineID],
                30 * 1E18
            );
        }

        if (_level == 2) {
            uint256 firstUpline = globalMatrixUserUpline[msg.sender][royalMatrixID];
            uint256 secondUpline = globalMatrixUserUpline[
                globalmartixUseraddress[royalMatrixID][firstUpline]
            ][1];
            /// --------------- have to check if second upline user is updated to level 2 ---------------------------///
            IERC20(BUSD).transfer(
                globalmartixUseraddress[royalMatrixID][secondUpline],
                30 * 1E18
            );
        }
    }