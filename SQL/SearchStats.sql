
ALTER PROCEDURE [dbo].[SearchResults_GetAllPaged]

@PageNum INT = NULL,
@RowCount INT = NULL,

--Athlete Info:
@Name NVARCHAR(500) = NULL,
@State NVARCHAR(100) = NULL,
@City NVARCHAR(100) = NULL,
@School NVARCHAR(500) = NULL,

--Athlete Education:
@MinSAT INT = NULL,
@MaxSAT INT = NULL,
@MinACT INT = NULL,
@MaxACT INT = NULL,
@MinGPA DECIMAL(3, 2) = NULL,
@MaxGPA DECIMAL(3, 2) = NULL,

-- Pitcher Criteria:
@MinERA INT = NULL,
@MaxERA INT = NULL,
@MinInnings INT = NULL,
@MaxInnings INT = NULL,
@MinStrikeouts INT = NULL,
@MaxStrikeouts INT = NULL,
@MinWalks INT = NULL,
@MaxWalks INT = NULL,
@PitchingHandedness NVARCHAR(50) = NULL,

-- Hitter Criteria:
@MinBattingAverage DECIMAL(5, 2) = NULL,
@MaxBattingAverage DECIMAL(5, 2) = NULL,
@MinXBH INT = NULL,
@MaxXBH INT = NULL,
@MinRBI INT = NULL,
@MaxRBI INT = NULL,
@MinOnBasePct DECIMAL(5, 2) = NULL,
@MaxOnBasePct DECIMAL(5, 2) = NULL,
@MinStolenBases INT = NULL,
@MaxStolenBases INT = NULL,
@HittingHandedness NVARCHAR(50) = NULL

AS
/*
EXEC SearchResults_GetAllPaged @PageNum=1, @RowCount=5, @Name='Athlete'
select * from users
*/

DECLARE @UserIds TABLE (
	Id INT PRIMARY KEY NOT NULL
)

INSERT @UserIds
(Id)
SELECT Id
FROM Users
WHERE UserTypeId = 1

IF @Name IS NOT NULL AND @Name != ''
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT u.Id
        FROM Users u
		WHERE u.FullName like '%' + @Name + '%'
		AND u.UserTypeId = 1
    )

IF @State IS NOT NULL AND @State != ''
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT Id
        FROM Users u INNER JOIN ZipCodes z
		ON u.ZipCode = z.Zipcode
        WHERE z.State = @State
    )

IF @City IS NOT NULL AND @City != ''
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT Id
        FROM Users u INNER JOIN ZipCodes z
		ON u.ZipCode = z.Zipcode
		where z.City = @City
    )

IF @School IS NOT NULL AND @School != ''
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM Athletes
        WHERE SchoolId = (
			SELECT Id
			FROM SchoolsInfo
			WHERE SchoolName like '%' + @School + '%'
		)
    )

IF @MinSAT IS NOT NULL OR @MaxSAT IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE SAT IS NOT NULL
        AND (@MinSAT IS NULL OR @MinSAT <= SAT)
        AND (@MaxSAT IS NULL OR @MaxSAT >= SAT)
    )    

IF @MinACT IS NOT NULL OR @MaxACT IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE ACT IS NOT NULL
        AND (@MinACT IS NULL OR @MinACT <= ACT)
        AND (@MaxACT IS NULL OR @MaxACT >= ACT)
    )   

IF @MinGPA IS NOT NULL OR @MaxGPA IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE GPA IS NOT NULL
        AND (@MinGPA IS NULL OR @MinGPA <= GPA)
        AND (@MaxGPA IS NULL OR @MaxGPA >= GPA)
    )   

IF @MinERA IS NOT NULL OR @MaxERA IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE ERA IS NOT NULL
        AND (@MinERA IS NULL OR @MinERA <= ERA)
        AND (@MaxERA IS NULL OR @MaxERA >= ERA)
    )

IF @MinInnings IS NOT NULL OR @MaxInnings IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE InningsPitched IS NOT NULL
        AND (@MinInnings IS NULL OR @MinInnings <= InningsPitched)
        AND (@MaxInnings IS NULL OR @MaxInnings >= InningsPitched)
    )

IF @MinStrikeouts IS NOT NULL OR @MaxStrikeouts IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE Strikeouts IS NOT NULL
        AND (@MinStrikeouts IS NULL OR @MinStrikeouts <= Strikeouts)
        AND (@MaxStrikeouts IS NULL OR @MaxStrikeouts >= Strikeouts)
    )

IF @MinWalks IS NOT NULL OR @MaxWalks IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE Walks IS NOT NULL
        AND (@MinWalks IS NULL OR @MinWalks <= Walks)
        AND (@MaxWalks IS NULL OR @MaxWalks >= Walks)
    )

IF @PitchingHandedness IS NOT NULL AND @PitchingHandedness != ''
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE PitchingHandedness = @PitchingHandedness
    )

IF @MinBattingAverage IS NOT NULL OR @MaxBattingAverage IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE BattingAverage IS NOT NULL
        AND (@MinBattingAverage IS NULL OR @MinBattingAverage <= BattingAverage)
        AND (@MaxBattingAverage IS NULL OR @MaxBattingAverage >= BattingAverage)
    )

IF @MinXBH IS NOT NULL OR @MaxXBH IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE XBH IS NOT NULL
        AND (@MinXBH IS NULL OR @MinXBH <= XBH)
        AND (@MaxXBH IS NULL OR @MaxXBH >= XBH)
    )

IF @MinRBI IS NOT NULL OR @MaxRBI IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE RBI IS NOT NULL
        AND (@MinRBI IS NULL OR @MinRBI <= RBI)
        AND (@MaxRBI IS NULL OR @MaxRBI >= RBI)
    )

IF @MinOnBasePct IS NOT NULL OR @MaxOnBasePct IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE OnBasePct IS NOT NULL
        AND (@MinOnBasePct IS NULL OR @MinOnBasePct <= OnBasePct)
        AND (@MaxOnBasePct IS NULL OR @MaxOnBasePct >= OnBasePct)
    )

IF @MinStolenBases IS NOT NULL OR @MaxStolenBases IS NOT NULL
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE StolenBases IS NOT NULL
        AND (@MinStolenBases IS NULL OR @MinStolenBases <= StolenBases)
        AND (@MaxStolenBases IS NULL OR @MaxStolenBases >= StolenBases)
    )

IF @HittingHandedness IS NOT NULL AND @HittingHandedness != ''
    DELETE FROM @UserIds
    WHERE Id NOT IN (
        SELECT UserId
        FROM PersonalStats
        WHERE HittingHandedness = @HittingHandedness
    )

SELECT Id, 
COUNT(*) OVER() AS TotalRows
FROM @UserIds

ORDER BY Id
OFFSET (@PageNum - 1) * @RowCount ROWS
FETCH NEXT @RowCount ROWS ONLY

