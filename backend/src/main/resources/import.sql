-- Insert demo data for User
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('admin', 'admin@admin.at', 'ADMIN', '$2a$10$//9XMI4F0iERZqp7so7VAOsbH3GRgSYb8xtcZIXdliG12YEezaP6W', NULL, NULL);
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('john_doe', 'john.doe@example.com', 'EMPLOYEE', '$2a$10$JZcfmZu750yAzChOBXpDT.KflaI0ViCXJu8WOTL632GpDUIh4HiVy', 1, 1);
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('jane_smith', 'jane.smith@example.com', 'EMPLOYEE', '$2a$10$Sjasj01areX482nzo4QQqejPPOvFfOySFZxtToJouDsbpFMorWht6', 1, 1);
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('alice_jones', 'alice.jones@example.com', 'EMPLOYEE', '$2a$10$KM7tedBITuicqq0I8VOGTOAe7lY9tTXy.0jvuqqHJUawTAPyUV/oS', 1, 1);
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('bob_brown', 'bob.brown@example.com', 'EMPLOYEE', '$2a$10$INXg8Oyw1Y.2oGyNzFuTSeNSwgdFNo9Cc3jEcFzqibCDHlJY9EHFG', 1, 1);
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('leon steinhuber', 'leon.steinhuber@example.com', 'CUSTOMER', '$2a$10$L1J.O0rIkj9mJChc6wyO9utjuAMYDDe5/wJXvPhx51fBc/aJMCxfW', 2, 2);
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('michael leisch', 'michael.leisch@example.com', 'CUSTOMER', '$2a$10$cYAjuzcXgiAVvCIyh8jtyeLqts02esLWzUu54m1NmEFJ/f2ThlJK.', 2, 2);
INSERT INTO app_user (username, email, usertype, password, deputysupervisor_userid, supervisor_userid) VALUES ('yanik kendler', 'yanik.kendler@example.com', 'CUSTOMER', '$2a$10$Sfcpxtigra.DjEmHz8mlmuQwN8iHT9clPFGq8AEcUyPdgYqTJ0fIO', 2, 2);

INSERT INTO VideoFile(durationseconds, sizebytes, originalfileextension) values (32, 1000000, 'mp4');

-- Insert demo data for Video
INSERT INTO content (dtype, title, description, visibility, color, user_userid, videofile_videofileid) VALUES ('Video', 'Java Basics', 'Introduction to Java', 'self' , '#ABCDEF', 1, 1);
INSERT INTO content (dtype, title, description, visibility, color, user_userid) VALUES ('Video', 'Advanced Java', 'Deep dive into Java', 'customers' , '#FEDCBA', 1);
INSERT INTO content (dtype, title, description, visibility, color, user_userid) VALUES ('Video', 'Spring Boot Tutorial', 'Getting started with Spring Boot', 'internal' , '#BABA22', 1);
INSERT INTO content (dtype, title, description, visibility, color, user_userid) VALUES ('Video', 'Hibernate ORM', 'Understanding Hibernate ORM', 'everyone' , '#AFFE55', 2);

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
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (1, 1);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (4, 2);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (2, 3);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (3, 4);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (3, 2);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (3, 1);

-- Insert demo data for video_star_rating
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 1);
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 2);
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 3);
INSERT INTO content_starrating (video_contentid, starratings_ratingid) VALUES (1, 4);

-- Insert demo data for Learning Paths
INSERT INTO content (dtype, title, description, visibility, color, user_userid) VALUES ('LearningPath', 'Java Developer', 'Become a Java Developer', 'everyone', '#BDA123', 1);
INSERT INTO content (dtype, title, description, visibility, color, user_userid) VALUES ('LearningPath', 'Spring Boot Developer', 'Become a Spring Boot Developer', 'everyone', '#123456', 1);
INSERT INTO content (dtype, title, description, visibility, color, user_userid) VALUES ('LearningPath', 'Hibernate ORM Developer', 'Become a Hibernate ORM Developer', 'everyone', '#A1B2C3', 1);

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
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (5, 1);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (5, 3);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (6, 3);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (6, 4);
INSERT INTO content_tag (content_contentid, tags_tagid) VALUES (7, 4);

-- Insert demo data for Notification
INSERT INTO Notification (text, user_userid, timestamp) VALUES ('Your video has been approved.', 1, '2023-10-01 10:00:00');
INSERT INTO Notification (text, user_userid, timestamp) VALUES ('New comment on your video.', 2, '2023-10-02 11:30:00');
INSERT INTO Notification (text, user_userid, timestamp) VALUES ('Your subscription is about to expire.', 3, '2023-10-03 14:45:00');
INSERT INTO Notification (text, user_userid, timestamp) VALUES ('You have a new follower.', 4, '2023-10-04 09:20:00');

-- Insert demo data for VideoAssignment
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp) VALUES (1, 1, 1, '2023-10-01');
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp) VALUES (2, 3, 2, '2023-10-02');
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp) VALUES (3, 4, 3, '2023-10-03');
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp) VALUES (4, 4, 4, '2023-10-04');
INSERT INTO contentassignment (content_contentid, assignedby_userid, assignedto_userid, timestamp) VALUES (5, 3, 1, '2023-10-05');

-- Insert demo data for ViewProgress
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (1, 1, 8, '2023-10-01 10:00:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (1, 2, 75, '2023-10-01 10:30:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (2, 1, 200, '2023-10-02 11:00:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (2, 2, 300, '2023-10-02 11:30:00', false);

INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (5, 1, 1, '2023-10-02 11:30:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (5, 2, 1, '2023-10-02 11:30:00', false);
INSERT INTO ViewProgress (content_contentid, user_userid, progress, timestamp, ignored) VALUES (6, 1, 1, '2023-10-02 11:30:00', false);