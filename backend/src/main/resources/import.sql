-- Insert demo data for Video
INSERT INTO Video (title, description, saved, visibility, color) VALUES ('Java Basics', 'Introduction to Java', true, 'self' , 'red');
INSERT INTO Video (title, description, saved, visibility, color) VALUES ('Advanced Java', 'Deep dive into Java', true, 'customers' , 'black');
INSERT INTO Video (title, description, saved, visibility, color) VALUES ('Spring Boot Tutorial', 'Getting started with Spring Boot', false, 'internal' , 'grey');
INSERT INTO Video (title, description, saved, visibility, color) VALUES ('Hibernate ORM', 'Understanding Hibernate ORM', true, 'everyone' , 'white');

-- Insert demo data for Question
INSERT INTO Question (text, title) VALUES ('What is the main topic of the video?', 'Main Topic');
INSERT INTO Question (text, title) VALUES ('Can you explain the key concepts covered?', 'Key Concepts');
INSERT INTO Question (text, title) VALUES ('What is the key takeaway from the tutorial?', 'Key Takeaway');
INSERT INTO Question (text, title) VALUES ('How can I apply this knowledge in practice?', 'Application');

-- Insert demo data for AnswerOption
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Option 1', true);
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Option 2', false);
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Leon hardcarried', false);
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Leon wird hardcarried', true);
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Michi und Leon sind zusammen', true);
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Michi ist single', false);
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Yanik ist schlecht in Programmieren', false);
INSERT INTO AnswerOption ( name, isCorrect) VALUES ( 'Leif Erikson war der erste Europäer in Amerika', true);

-- Insert demo data for question_answer_option
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (1, 1);
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (1, 2);
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (1, 3);
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (2, 4);
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (3, 5);
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (3, 6);
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (4, 7);
INSERT INTO question_answeroption (question_questionid, answeroptions_questionoptionid) VALUES (4, 8);

-- Insert demo data for ViewProgress
INSERT INTO ViewProgress (video_videoid, timestamp, progress) VALUES (1, '2023-10-01 10:00:00', 50);
INSERT INTO ViewProgress (video_videoid, timestamp, progress) VALUES (1, '2023-10-02 11:30:00', 100);
INSERT INTO ViewProgress (video_videoid, timestamp, progress) VALUES (2, '2023-10-03 14:45:00', 75);
INSERT INTO ViewProgress (video_videoid, timestamp, progress) VALUES (2, '2023-10-04 09:20:00', 25);

-- Insert demo data for Comment
INSERT INTO Comment (text) VALUES ('Great video!');
INSERT INTO Comment (text) VALUES ('Very informative.');
INSERT INTO Comment (text) VALUES ('Nice tutorial.');
INSERT INTO Comment (text) VALUES ('Loved the explanation.');

-- Insert demo data for StarRating
INSERT INTO StarRating (rating) VALUES (1);
INSERT INTO StarRating (rating) VALUES (2);
INSERT INTO StarRating (rating) VALUES (3);
INSERT INTO StarRating (rating) VALUES (4);


-- Insert demo data for Tag
INSERT INTO Tag (name) VALUES ('Education');
INSERT INTO Tag (name) VALUES ('Tutorial');
INSERT INTO Tag (name) VALUES ('Java');
INSERT INTO Tag (name) VALUES ('Programming');

-- Insert demo data for video_comment
INSERT INTO video_comment (video_videoid, comments_commentid) VALUES (1, 2);
INSERT INTO video_comment (video_videoid, comments_commentid) VALUES (4, 1);
INSERT INTO video_comment (video_videoid, comments_commentid) VALUES (2, 3);
INSERT INTO video_comment (video_videoid, comments_commentid) VALUES (3, 4);

-- Insert demo data for video_question
INSERT INTO video_question (video_videoid, questions_questionid) VALUES (2, 1);
INSERT INTO video_question (video_videoid, questions_questionid) VALUES (4, 2);
INSERT INTO video_question (video_videoid, questions_questionid) VALUES (3, 3);
INSERT INTO video_question (video_videoid, questions_questionid) VALUES (1, 4);

-- Insert demo data for video_tag
INSERT INTO video_tag (video_videoid, tags_tagid) VALUES (1, 1);
INSERT INTO video_tag (video_videoid, tags_tagid) VALUES (4, 2);
INSERT INTO video_tag (video_videoid, tags_tagid) VALUES (2, 3);
INSERT INTO video_tag (video_videoid, tags_tagid) VALUES (3, 4);

-- Insert demo data for video_star_rating
INSERT INTO video_starrating (video_videoid, starratings_ratingid) VALUES (1, 1);
INSERT INTO video_starrating (video_videoid, starratings_ratingid) VALUES (4, 2);
INSERT INTO video_starrating (video_videoid, starratings_ratingid) VALUES (2, 3);
INSERT INTO video_starrating (video_videoid, starratings_ratingid) VALUES (3, 4);

-- Insert demo data for User
INSERT INTO app_user (username, email, user_type) VALUES ('john_doe', 'john.doe@example.com', 'CUSTOMER');
INSERT INTO app_user (username, email, user_type) VALUES ('jane_smith', 'jane.smith@example.com', 'CUSTOMER');
INSERT INTO app_user (username, email, user_type) VALUES ('alice_jones', 'alice.jones@example.com', 'EMPLOYEE');
INSERT INTO app_user (username, email, user_type) VALUES ('bob_brown', 'bob.brown@example.com', 'EMPLOYEE');
INSERT INTO app_user (username, email, user_type) VALUES ('leon steinhuber', 'leon.steinhuber@example.com', 'EMPLOYEE');
INSERT INTO app_user (username, email, user_type) VALUES ('michael leisch', 'michael.leisch@example.com', 'EMPLOYEE');
INSERT INTO app_user (username, email, user_type) VALUES ('yanik kendler', 'yanik.kendler@example.com', 'EMPLOYEE');

-- Insert demo data for Customer
INSERT INTO Customer (userid, companyName, isManager, supervisor_userid) VALUES (1, 'TechCorp', true, null);
INSERT INTO Customer (userid, companyName, isManager, supervisor_userid) VALUES (2, 'TechCorp', false, 1);


-- Insert demo data for Employee
INSERT INTO Employee (userid,supervisor_userId, deputySupervisor_userId, isAdmin) VALUES (3 , NULL, NULL, false);
INSERT INTO Employee (userid,supervisor_userId, deputySupervisor_userId, isAdmin) VALUES (4 ,3, null, true);
INSERT INTO Employee (userid,supervisor_userId, deputySupervisor_userId, isAdmin) VALUES (5 ,3, 4, false);
INSERT INTO Employee (userid,supervisor_userId, deputySupervisor_userId, isAdmin) VALUES (6 ,4, 5, false);
INSERT INTO Employee (userid,supervisor_userId, deputySupervisor_userId, isAdmin) VALUES (7 ,6, 4, true);

-- Insert demo data for Notification
INSERT INTO Notification (text, user_userid, datetime) VALUES ('Your video has been approved.', 1, '2023-10-01 10:00:00');
INSERT INTO Notification (text, user_userid, datetime) VALUES ('New comment on your video.', 2, '2023-10-02 11:30:00');
INSERT INTO Notification (text, user_userid, datetime) VALUES ('Your subscription is about to expire.', 3, '2023-10-03 14:45:00');
INSERT INTO Notification (text, user_userid, datetime) VALUES ('You have a new follower.', 4, '2023-10-04 09:20:00');

-- Insert demo data for VideoAssignment
INSERT INTO VideoAssignment (video_videoid, assignedby_userid, assignedto_userid, date) VALUES (1, 1, 1, '2023-10-01');
INSERT INTO VideoAssignment (video_videoid, assignedby_userid, assignedto_userid, date) VALUES (2, 3, 2, '2023-10-02');
INSERT INTO VideoAssignment (video_videoid, assignedby_userid, assignedto_userid, date) VALUES (3, 4, 3, '2023-10-03');
INSERT INTO VideoAssignment (video_videoid, assignedby_userid, assignedto_userid, date) VALUES (4, 4, 4, '2023-10-04');
