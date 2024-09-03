-- Insert demo data for Employees
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('admin', 'admin@admin', 'ADMIN', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', NULL, NULL);
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('john_doe', 'john@test', 'EMPLOYEE', '$2a$10$uoJGXc4bNnzppqsBB53s0epnvRDkvSE9xQe.fqUtrCZGWM0drRFGi', 1, 1);
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('jane_smith', 'jane@test', 'EMPLOYEE', '$2a$10$vFYOWxrLcR4SNHMY3z11oOiJGD.HpkBuxU/Uzr/ymipIW.myZQ6oO', 1, 1);
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('alice_jones', 'alice@test', 'EMPLOYEE', '$2a$10$cOW/k4lOFwx5zrYRlfTDDO60EO8ubn6ptLdLF86qooFtPEQcSSRfi', 1, 1);
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('bob_brown', 'bob@test', 'EMPLOYEE', '$2a$10$PrLNDgdld/EIqi4hmMVoIuhIvcAGsMggJ5MJuK2nNE.PbrUxHB2vO', 1, 1);
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('leon steinhuber', 'leon.steinhuber@test', 'EMPLOYEE', '$2a$10$j6/dJGVxar/nl370BLSmLOpYtSgFEyAVkaUlLYxrDjQOaNEfeEucW', 2, 2);
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('michael leisch', 'michael.leisch@gmx.at', 'EMPLOYEE', '$2a$10$ufluH.7UeSqY9xKIIx8OTObNcIE8pv8GR6EVWhMF1NofRm4uLzLUi', 2, 2);
INSERT INTO app_user (username, email, userRole, password, deputysupervisor_userid, supervisor_userid) VALUES ('yanik kendler', 'yanik.kendler@test', 'EMPLOYEE', '$2a$10$F9R.Ol/vTxLmwIAivLum5.JcIxa81YAUtcqSnLaTPhXTaT3/OxZyS', 7, 7);

-- Insert demo data for Customers
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('peter', 'customer1@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', NULL);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('arnold', 'customer2@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', 9);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('josh', 'customer3@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', 9);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('mark', 'customer4@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', 9);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('maximialian der 3.', 'customer5@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', NULL);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('leif eriksson', 'customer6@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', 13);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('barack obama', 'customer7@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', 13);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('tailor-swift', 'customer8@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', 13);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('swiftieee', 'customer9@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', NULL);
INSERT INTO app_user (username, email, userRole, password, supervisor_userid) VALUES ('BoB', 'customer10@test', 'CUSTOMER', '$2a$10$862S1SeLTlFdf7kYFKpNyescyiNuAHGbiFeZ4z02VHdESGcw5ULfu', 17);




INSERT INTO VideoFile(durationseconds, sizebytes, originalfileextension) values (32, 1000000, 'mp4');

-- Insert demo data for Video
INSERT INTO content (dtype, title, description, visibility, color, user_userid, approved, videofile_videofileid) VALUES ('Video', 'Java Basics', 'Introduction to Java', 'self' , '#ABCDEF', 1,false, 1);
INSERT INTO content (dtype, title, description, visibility, color, user_userid, approved) VALUES ('Video', 'Advanced Java', 'Deep dive into Java', 'customers' , '#FEDCBA', 1,true);
INSERT INTO content (dtype, title, description, visibility, color, user_userid, approved) VALUES ('Video', 'Spring Boot Tutorial', 'Getting started with Spring Boot', 'internal' , '#BABA22', 1,true);
INSERT INTO content (dtype, title, description, visibility, color, user_userid, approved) VALUES ('Video', 'Hibernate ORM', 'Understanding Hibernate ORM', 'everyone' , '#AFFE55', 2,true);

-- Insert demo data for Question
INSERT INTO Question (text, timestamp) VALUES ('Which planet is known as the Red Planet?', '2023-10-01 10:00:00');
INSERT INTO Question (text, timestamp) VALUES ('What is the capital of Tuvalu?', '2023-10-02 11:30:00');
INSERT INTO Question (text, timestamp) VALUES ('Wie kann man Geld am besten zu mehr Geld machen?', '2023-10-03 14:45:00');
INSERT INTO Question (text, timestamp) VALUES ('Who was the first European in America', '2023-10-04 09:20:00');

-- Insert demo data for AnswerOption
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Mars', true);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Earth', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Jupiter', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Pago Pago', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Montevideo', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Funafuti', true);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Ouagadougou', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Einfach das Geld anpflanzen.', true);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'In Aktien Investieren', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Alles für Essen ausgeben', true);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Gold kaufen', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Barack Obama', false);
INSERT INTO AnswerOption ( text, isCorrect) VALUES ( 'Leif Erikson', true);

-- Insert demo data for question_answer_option
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (1, 1);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (1, 2);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (1, 3);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (2, 4);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (2, 5);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (2, 6);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (2, 7);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (3, 8);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (3, 9);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (3, 10);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (3, 11);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (4, 12);
INSERT INTO question_answeroption (question_questionid, answeroptions_answeroptionid) VALUES (4, 13);

-- Insert demo data for Comment
INSERT INTO Comment (text, user_userid, timestamp) VALUES ('Great video!', 1, '2023-4-01 10:00:00');
INSERT INTO Comment (text, user_userid, timestamp) VALUES ('Very informative.', 2, '2023-10-02 11:30:00');
INSERT INTO Comment (text, user_userid, timestamp) VALUES ('Nice tutorial.', 3, '2023-10-03 14:45:00');
INSERT INTO Comment (text, user_userid, timestamp) VALUES ('Loved the explanation.', 2, '2024-08-07 09:20:00');

-- Insert demo data for StarRating
INSERT INTO StarRating (rating) VALUES (2);
INSERT INTO StarRating (rating) VALUES (2);
INSERT INTO StarRating (rating) VALUES (3);
INSERT INTO StarRating (rating) VALUES (4);

-- Insert demo data for Tag
INSERT INTO Tag (name) VALUES ('Education');
INSERT INTO Tag (name) VALUES ('Tutorial');
INSERT INTO Tag (name) VALUES ('Java');
INSERT INTO Tag (name) VALUES ('Programming');

-- Insert demo data for video_comment
INSERT INTO content_comment (video_contentid, comments_commentid) VALUES (1, 1);
INSERT INTO content_comment (video_contentid, comments_commentid) VALUES (1, 2);
INSERT INTO content_comment (video_contentid, comments_commentid) VALUES (1, 3);
INSERT INTO content_comment (video_contentid, comments_commentid) VALUES (1, 4);

-- Insert demo data for video_question
INSERT INTO content_question (video_contentid, questions_questionid) VALUES (1, 1);
INSERT INTO content_question (video_contentid, questions_questionid) VALUES (1, 2);
INSERT INTO content_question (video_contentid, questions_questionid) VALUES (1, 3);
INSERT INTO content_question (video_contentid, questions_questionid) VALUES (1, 4);

-- Insert demo data for video_tag
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (1, 1);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (4, 2);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (2, 3);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (3, 4);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (3, 2);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (3, 1);

-- Insert demo data for video_star_rating
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 1);
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 2);
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 3);
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 4);

-- Insert demo data for Learning Paths
INSERT INTO content (dtype, title, description, visibility, color, user_userid, approved) VALUES ('LearningPath', 'Java Developer', 'Become a Java Developer', 'everyone', '#BDA123', 1, true);
INSERT INTO content (dtype, title, description, visibility, color, user_userid, approved) VALUES ('LearningPath', 'Spring Boot Developer', 'Become a Spring Boot Developer', 'everyone', '#123456', 1, true);
INSERT INTO content (dtype, title, description, visibility, color, user_userid, approved) VALUES ('LearningPath', 'Hibernate ORM Developer', 'Become a Hibernate ORM Developer', 'self', '#A1B2C3', 1, false);

-- Insert demo data for Learning Path Entry
INSERT INTO learningpathentry (video_contentid, entryposition) VALUES (1, 1);
INSERT INTO learningpathentry (video_contentid, entryposition) VALUES (2, 2);
INSERT INTO learningpathentry (video_contentid, entryposition) VALUES (3, 1);
INSERT INTO learningpathentry (video_contentid, entryposition) VALUES (1, 2);
INSERT INTO learningpathentry (video_contentid, entryposition) VALUES (2, 3);
INSERT INTO learningpathentry (video_contentid, entryposition) VALUES (4, 1);

-- Insert demo data for Learning Path Content
INSERT INTO content_learningpathentry (learningpath_contentid, entries_pathentryid) VALUES (5, 1);
INSERT INTO content_learningpathentry (learningpath_contentid, entries_pathentryid) VALUES (5, 2);
INSERT INTO content_learningpathentry (learningpath_contentid, entries_pathentryid) VALUES (6, 3);
INSERT INTO content_learningpathentry (learningpath_contentid, entries_pathentryid) VALUES (6, 4);
INSERT INTO content_learningpathentry (learningpath_contentid, entries_pathentryid) VALUES (6, 5);
INSERT INTO content_learningpathentry (learningpath_contentid, entries_pathentryid) VALUES (7, 6);

-- Insert demo data for Learning Path Tags
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (5, 1);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (5, 3);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (6, 3);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (6, 4);
INSERT INTO content_tag (usagelist_contentid, tags_tagid) VALUES (7, 4);

-- Insert demo data for VideoAssignment
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp, isfinished) VALUES (1, 1, 2, '2023-10-01', true);
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp, isfinished) VALUES (2, 1, 2, '2023-10-02', false);
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp, isfinished) VALUES (3, 4, 3, '2023-10-03', false);
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp, isfinished) VALUES (4, 4, 4, '2023-10-04', false);
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp, isfinished) VALUES (5, 1, 2, '2023-10-05', false);
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp, isfinished) VALUES (6, 1, 2, '2023-10-05', true);

-- Insert demo data for ViewProgress
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (1, 1, 8, '2023-10-01 10:00:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (1, 2, 75, '2023-10-01 10:30:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (2, 1, 200, '2023-10-02 11:00:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (2, 2, 300, '2023-10-02 11:30:00', false);

INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (5, 1, 1, '2023-10-02 11:30:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (5, 2, 1, '2023-10-02 11:30:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (6, 1, 1, '2023-10-02 11:30:00', false);

-- Insert demo data for Notification
INSERT INTO Notification (dtype, foruser_userid, triggeredbyuser_userid, done, timestamp, content_contentid, type) VALUES ('ContentNotification', 1, 2, false, '2023-10-01 10:00:00', 1, 'update');
INSERT INTO Notification (dtype, foruser_userid, triggeredbyuser_userid, done, timestamp, content_contentid, type) VALUES ('ContentNotification', 1, 2, false, '2023-10-05 10:00:00', 1, 'assignment');
INSERT INTO Notification (dtype, foruser_userid, triggeredbyuser_userid, done, timestamp, requestMessage) VALUES ('VideoRequestNotification', 1, 2, false, '2023-10-11 10:00:00', 'Please make a video about Java');
INSERT INTO Notification (dtype, foruser_userid, triggeredbyuser_userid, done, timestamp, headertext, text) VALUES ('TextNotification', 1, 2, false, '2023-10-15 10:00:00', 'Follower', 'You have a new follower');
INSERT INTO Notification (dtype, foruser_userid, triggeredbyuser_userid, done, timestamp, comment_commentid, content_contentid) VALUES ('CommentNotification', 1, 2, false, '2023-10-17 10:00:00', 1, 1);

