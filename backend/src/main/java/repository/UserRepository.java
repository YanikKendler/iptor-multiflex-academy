package repository;

import dtos.*;
import dtos.ContentForUserDTO;
import dtos.VideoOverviewDTO;
import enums.ContentNotificationEnum;
import enums.UserRoleEnum;
import enums.VisibilityEnum;
import io.quarkus.datasource.runtime.DataSourcesBuildTimeConfig;
import io.quarkus.logging.Log;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

import java.util.List;

@ApplicationScoped
@Transactional
public class UserRepository {
    private static final Logger log = LoggerFactory.getLogger(UserRepository.class);
    @Inject
    EntityManager em;

    @Inject
    StarRatingRepository starRatingRepository;

    @Inject
    NotificationRepository notificationRepository;

    public User getById(Long id) {
        return em.find(User.class, id);
    }

    public void delete(Long userId, Long adminId) {
        em.createQuery("delete from ContentAssignment ca where ca.assignedTo.userId = :userId")
                .setParameter("userId", userId)
                .executeUpdate();

        em.createQuery("update ContentAssignment ca set ca.assignedBy.userId = :adminId where ca.assignedBy.userId = :userId")
                .setParameter("adminId", adminId)
                .setParameter("userId", userId)
                .executeUpdate();

        em.createQuery("update Content c set c.user.userId = :adminId where c.user.userId = :userId")
                .setParameter("adminId", adminId)
                .setParameter("userId", userId)
                .executeUpdate();

        em.createQuery("delete from Notification n where n.forUser.userId = :userId or n.triggeredByUser.userId = :userId")
                .setParameter("userId", userId)
                .executeUpdate();

        List<Comment> userComments = em.createQuery("select c from Comment c where c.user.userId = :userId", Comment.class)
                    .setParameter("userId", userId)
                    .getResultList();
        for (Comment userComment : userComments) {
            List<Video> commentVideos = em.createQuery("select v from Video v join v.comments c where c = :userComment", Video.class)
                    .setParameter("userComment", userComment)
                    .getResultList();
            for(Video video : commentVideos){
                video.getComments(null).remove(userComment);
            }

        }
        em.createQuery("delete from Comment c where c.user.userId = :userId")
                .setParameter("userId", userId)
                .executeUpdate();

        em.createQuery("delete from StarRating sr where sr.user.userId = :userId")
                .setParameter("userId", userId)
                .executeUpdate();

        em.createQuery("delete from ViewProgress vp where vp.user.userId = :userId")
                .setParameter("userId", userId)
                .executeUpdate();

        em.createQuery("delete from QuizResult qr where qr.user.userId = :userId")
                .setParameter("userId", userId)
                .executeUpdate();

        clearSupervisor(userId, adminId);

        em.remove(getById(userId));
    }

    public void updateRole(Long userId, Long adminId, UserRoleEnum newRole) {
        clearSupervisor(userId, adminId);

        User user = getById(userId);
        user.setUserRole(newRole);
        user.setSupervisor(null);
        user.setDeputySupervisor(null);
        em.merge(user);
    }

    public void clearSupervisor(Long userId, Long adminId) {
        em.createQuery("update User u set u.supervisor.userId = :adminId where u.supervisor.userId = :userId")
                .setParameter("adminId", adminId)
                .setParameter("userId", userId)
                .executeUpdate();

        em.createQuery("update User u set u.deputySupervisor.userId = :adminId where u.deputySupervisor.userId = :userId")
                .setParameter("adminId", adminId)
                .setParameter("userId", userId)
                .executeUpdate();
    }

    public List<User> getAll() {
        return em.createQuery("select u from User u order by u.username", User.class).getResultList();
    }

    public List<UserTreeDTO> getCustomers() {
        List<User> managers = em.createQuery(
                "select u from User u " +
                "where u.userRole = 'CUSTOMER' " +
                "and u.supervisor = null " +
                "order by u.username"
            , User.class)
            .getResultList();

        System.out.println(managers.toString());

        List<UserTreeDTO> result = new LinkedList<>();

        for (User manager : managers) {
            List<UserTreeDTO> subordinateDTOs = null;
            try{
                List<User> subordinates = em.createQuery(
                                "select u from User u " +
                                        "where u.supervisor.userId = :userId " +
                                        "order by u.username", User.class)
                        .setParameter("userId", manager.getUserId())
                        .getResultList();

                subordinateDTOs = subordinates.stream()
                        .map(user -> new UserTreeDTO(user.getUserId(), user.getUsername(), user.getEmail(), user.getUserRole(), 2, null))
                        .toList();

            }catch (Exception ignored){ ignored.printStackTrace(); }

            result.add(new UserTreeDTO(manager.getUserId(), manager.getUsername(), manager.getEmail(), manager.getUserRole(), 1, subordinateDTOs));
        }

        return result;
    }

    public ContentForUserDTO getContentForUser(Long userId, List<Tag> tags) {
        return new ContentForUserDTO(
                getCurrentContent(userId, tags),
                getAssignedContent(userId, tags),
                getSuggestedContent(userId, tags)
        );
    }

    public VideoAndLearningPathOverviewCollection getCurrentContent(Long userId, List<Tag> tags) {
        // Fetch unfinished videos
        // get all videos that are started but less than 90% done and not ignored
        // and that are equal to the filter tags
        List<Video> unfinishedVideos = em.createQuery(
                        "select distinct v from ViewProgress vp " +
                                "join Video v on v.contentId = vp.content.contentId " +
                                "left join v.tags vt " +
                                "where vp.user.userId = :userId and vp.ignored = false " +
                                "and vp.progress < v.videoFile.durationSeconds * 0.90 " +
                                "and ((vt is null and :areTagsEmpty = true) or not exists (" +
                                "    select t from Tag t " +
                                "    where t in :tags and t not in elements(v.tags)" +
                                "))", Video.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .setParameter("areTagsEmpty", tags.isEmpty())
                .getResultList();

        // Fetch saved content
        // get saved content that are equal to the filter tags
        List<Content> savedContent = em.createQuery(
                        "select distinct sv from User u " +
                                "join u.savedContent sv " +
                                "join sv.tags vt " +
                                "where u.userId = :userId " +
                                "and ((vt is null and :areTagsEmpty = true) or not exists (" +
                                "    select t from Tag t " +
                                "    where t in :tags and t not in elements(sv.tags)" +
                                "))", Content.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .setParameter("areTagsEmpty", tags.isEmpty())
                .getResultList();

        // Separate saved videos and learning paths
        List<Video> savedVideos = savedContent.stream()
                .filter(content -> content instanceof Video)
                .map(content -> (Video) content).toList();

        List<LearningPath> savedLearningPaths = savedContent.stream()
                .filter(content -> content instanceof LearningPath)
                .map(content -> (LearningPath) content).toList();

        // Combine unfinished and saved videos
        Set<Video> combinedVideos = new HashSet<>(unfinishedVideos);
        combinedVideos.addAll(savedVideos);

        // Filter out videos that are not visible for the user
        List<Video> visibleVideos = new ArrayList<>();
        combinedVideos.forEach(video -> {
            if(video.isVisibleForUser(getById(userId))){
                visibleVideos.add(video);
            }
        });

        // Convert to VideoOverviewDTO
        List<VideoOverviewDTO> currentVideos = visibleVideos.stream()
                .map(video -> convertVideoToOverviewDTO(video, userId)).toList();

        // Fetch unfinished learning paths
        // get all learning paths that are started but not done yet and not ignored
        // and that are equal to the filter tags
        List<LearningPath> unfinishedLearningPaths = em.createQuery(
                        "select distinct lp from ViewProgress vp " +
                                "join LearningPath lp on lp.contentId = vp.content.contentId " +
                                "join lp.tags t " +
                                "where vp.user.userId = :userId and vp.ignored = false " +
                                "and vp.progress < (select count(e) from lp.entries e) " +
                                "and ((t is null and :areTagsEmpty = true) or not exists (" +
                                "    select t from Tag t " +
                                "    where t in :tags and t not in elements(lp.tags)" +
                                "))", LearningPath.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .setParameter("areTagsEmpty", tags.isEmpty())
                .getResultList();

        // Combine unfinished and saved learning paths
        Set<LearningPath> combinedLearningPaths = new HashSet<>(unfinishedLearningPaths);
        combinedLearningPaths.addAll(savedLearningPaths);

        // Filter out learning paths that are not visible for the user
        List<LearningPath> visiblePaths = new ArrayList<>();
        combinedLearningPaths.forEach(learningPath -> {
            if(learningPath.isVisibleForUser(getById(userId))){
                visiblePaths.add(learningPath);
            }
        });

        // Convert to LearningPathOverviewDTO
        List<LearningPathOverviewDTO> currentLearningPaths = visiblePaths.stream()
                .map(learningPath -> convertLearningPathToOverviewDTO(learningPath, userId)).toList();

        return new VideoAndLearningPathOverviewCollection(currentVideos, currentLearningPaths);
    }

    public VideoAndLearningPathOverviewCollection getAssignedContent(Long userId, List<Tag> tags) {
        List<Video> assignedVideos = em.createQuery("select distinct v from Video v " +
                        "join ContentAssignment va on va.content.contentId = v.contentId " +
                        "left outer join v.tags t " +
                        "where va.assignedTo.userId = :userId and va.isFinished = false " +
                        "and ((t is null and :areTagsEmpty = true) or not exists (" +
                        "    select t from Tag t " +
                        "    where t in :tags and t not in elements(v.tags)" +
                        "))", Video.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .setParameter("areTagsEmpty", tags.isEmpty())
                .getResultList();

        System.out.println("Assigned videos:" + assignedVideos.size());

        List<Video> visibleVideos = new ArrayList<>();
        assignedVideos.forEach(video -> {
            System.out.println(video);
            if (video.isVisibleForUser(getById(userId))) {
                visibleVideos.add(video);
            }
        });

        List<VideoOverviewDTO> assignedVideosDTO = visibleVideos.stream()
                .map(video -> convertVideoToOverviewDTO(video, userId)).toList();

        List<LearningPath> assignedLearningPaths = em.createQuery("select distinct lp from LearningPath lp " +
                        "join ContentAssignment va on va.content.contentId = lp.contentId " +
                        "left outer join lp.tags t " +
                        "where va.assignedTo.userId = :userId and va.isFinished = false " +
                        "and ((t is null and :areTagsEmpty = true) or not exists (" +
                        "    select t from Tag t " +
                        "    where t in :tags and t not in elements(lp.tags)" +
                        "))", LearningPath.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .setParameter("areTagsEmpty", tags.isEmpty())
                .getResultList();

        List<LearningPath> visiblePaths = new ArrayList<>();
        assignedLearningPaths.forEach(learningPath -> {
            if(learningPath.isVisibleForUser(getById(userId))){
                visiblePaths.add(learningPath);
            }
        });

        List<LearningPathOverviewDTO> assignedLearningPathsDTO = visiblePaths.stream()
                .map(learningPath -> convertLearningPathToOverviewDTO(learningPath, userId)).toList();

        return new VideoAndLearningPathOverviewCollection(assignedVideosDTO, assignedLearningPathsDTO);
    }

    public VideoAndLearningPathOverviewCollection getSuggestedContent(Long userId, List<Tag> filterTags) {
        // get all tags of the users watched videos and learning paths
        List<Tag> tags = em.createQuery("select distinct t from Video v " +
                        "join ViewProgress vp on vp.content.contentId = v.contentId " +
                        "join v.tags t " +
                        "where vp.user.userId = :userId ", Tag.class)
                .setParameter("userId", userId).getResultList();

        // get the saved content ids
        List<Long> savedContent = em.createQuery("select c.contentId from User u " +
                        "join u.savedContent c " +
                        "join c.tags t " +
                        "where u.userId = :userId ", Long.class)
                .setParameter("userId", userId).getResultList();

        // getting all videos and learning paths that are not saved by the user,
        // not ignored and equal to the filter tags
        List<Video> videos;
        List<LearningPath> learningPaths;
        if (savedContent.isEmpty()) {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "left outer join v.tags t " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId and ignored = false) " +
                                    "and ((t is null and :areTagsEmpty = true) or not exists (" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(v.tags)" +
                                    "))", Video.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .setParameter("areTagsEmpty", filterTags.isEmpty())
                    .getResultList();

            learningPaths = em.createQuery(
                            "select lp from LearningPath lp " +
                                    "left outer join lp.tags t " +
                                    "where lp.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId and ignored = false) " +
                                    "and ((t is null and :areTagsEmpty = true) or not exists (" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(lp.tags)" +
                                    "))", LearningPath.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .setParameter("areTagsEmpty", filterTags.isEmpty())
                    .getResultList();
        } else {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "left outer join v.tags t " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId) and " +
                                    "v.contentId not in :savedContent " +
                                    "and ((t is null and :areTagsEmpty = true) or not exists (" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(v.tags)" +
                                    "))", Video.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .setParameter("savedContent", savedContent)
                    .setParameter("areTagsEmpty", filterTags.isEmpty())
                    .getResultList();

            learningPaths = em.createQuery(
                            "select lp from LearningPath lp " +
                                    "left outer join lp.tags t " +
                                    "where lp.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId) and " +
                                    "lp.contentId not in :savedContent " +
                                    "and ((t is null and :areTagsEmpty = true) or not exists (" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(lp.tags)" +
                                    "))", LearningPath.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .setParameter("savedContent", savedContent)
                    .setParameter("areTagsEmpty", filterTags.isEmpty())
                    .getResultList();
        }

        // calculate the score for each video and learning path
        HashMap<Video, Integer> videoScores = new HashMap<>();
        HashMap<LearningPath, Integer> learningPathScores = new HashMap<>();

        User user = em.find(User.class, userId);
        videos.forEach(video -> {
            if(video.isVisibleForUser(user)){
                double avgStarRating = starRatingRepository.getAverage(video.getContentId());

                // every tag that is in the video tags and the user tags gets a score of 1
                double tagScore = video.getTags().stream().mapToDouble(tag -> tags.contains(tag) ? 1 : 0).sum();

                videoScores.put(video, (int) (avgStarRating + tagScore*2.5));
            }
        });

        learningPaths.forEach(learningPath -> {
            if(learningPath.isVisibleForUser(user)){

                // every tag that is in the learning path tags and the user tags gets a score of 1
                double tagScore = learningPath.getTags().stream().mapToDouble(tag -> tags.contains(tag) ? 1 : 0).sum();

                learningPathScores.put(learningPath, (int) (tagScore));
            }
        });

        // sort by score
        List<Map.Entry<Video, Integer>> sortedVideos = new ArrayList<>(videoScores.entrySet()
                .stream().sorted(Map.Entry.comparingByValue()).toList());

        List<Map.Entry<LearningPath, Integer>> sortedLearningPaths = new ArrayList<>(learningPathScores.entrySet()
                .stream().sorted(Map.Entry.comparingByValue()).toList());

        Collections.reverse(sortedVideos);
        Collections.reverse(sortedLearningPaths);

        // parse it into the video overview dto

        return new VideoAndLearningPathOverviewCollection(
                sortedVideos.stream().map(entry -> convertVideoToOverviewDTO(entry.getKey(), userId)).toList(),
                sortedLearningPaths.stream().map(entry -> convertLearningPathToOverviewDTO(entry.getKey(), userId)).toList()
        );
    }

    public VideoOverviewDTO convertVideoToOverviewDTO(Video video, Long userId) {
        ViewProgress viewProgress;
        try {
            viewProgress = em.createQuery(
                            "select vp from ViewProgress vp " +
                                    "where vp.user.userId = :userId " +
                                    "and vp.content.contentId = :videoId", ViewProgress.class)
                    .setParameter("userId", userId)
                    .setParameter("videoId", video.getContentId())
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (Exception e) {
            viewProgress = null;
        }

        boolean saved = isVideoSaved(video.getContentId(), userId);

        if (video.getVideoFile() != null) {
            return new VideoOverviewDTO(video.getContentId(), video.getTitle(), video.getDescription(), video.getTags(), saved, video.getColor(), video.getVideoFile().getDurationSeconds(), video.getQuestions().size(), viewProgress);
        }
        return new VideoOverviewDTO(video.getContentId(), video.getTitle(), video.getDescription(), video.getTags(), saved, video.getColor(), null, video.getQuestions().size(), viewProgress);
    }

    public boolean isVideoSaved(Long contentId, Long userId) {
        User user = getById(userId);
        return user.getSavedContent().stream().anyMatch(video -> video.getContentId().equals(contentId));
    }

    public LearningPathOverviewDTO convertLearningPathToOverviewDTO(Content learningPath, Long userId) {
        ViewProgress viewProgress;
        try {
            viewProgress = em.createQuery(
                            "select vp from ViewProgress vp " +
                                    "where vp.user.userId = :userId " +
                                    "and vp.content.contentId = :learningPathId", ViewProgress.class)
                    .setParameter("userId", userId)
                    .setParameter("learningPathId", learningPath.getContentId())
                    .setMaxResults(1)
                    .getSingleResult();
        } catch (NoResultException e) {
            viewProgress = null;
        }

        boolean saved = isLearningPathSaved(userId, learningPath.getContentId());

        long videoCount = em.createQuery("select count(lp) from LearningPath lp join lp.entries where lp.contentId = :learningPathId", Long.class)
                .setParameter("learningPathId", learningPath.getContentId())
                .getSingleResult();

        return new LearningPathOverviewDTO(learningPath.getContentId(), learningPath.getTitle(), learningPath.getDescription(), learningPath.getTags(), (int) videoCount, viewProgress, learningPath.getColor(), saved);
    }

    public boolean isLearningPathSaved(Long userId, Long learningPathId) {
        User user = getById(userId);
        return user.getSavedContent().stream().anyMatch(learningPath -> learningPath.getContentId().equals(learningPathId));
    }

    public void toggleSavedVideo(Long userId, Long contentId) {
        User user = getById(userId);
        user.toggleSavedContent(em.find(Content.class, contentId));
        em.merge(user);
    }

    public List<MyVideoDTO> getUserVideos(Long userId) {
        if (getById(userId).getUserRole() == UserRoleEnum.CUSTOMER) {
            return null;
        }

        // getting all videos that are editable by the user
        List<Video> videos = em.createQuery("select v from Video v" +
                        " where (v.visibility = 'self' and v.user.userId = :userId) or :isAdmin = true or v.visibility != 'self'" +
                        " order by v.contentId", Video.class)
                .setParameter("userId", userId)
                .setParameter("isAdmin", getById(userId).getUserRole() == UserRoleEnum.ADMIN)
                .getResultList();

        // returning the videos as DTOs
        return videos.stream().map(video -> {
            long views = em.createQuery("select count(vp) from ViewProgress vp where vp.content.contentId = :contentId", Long.class)
                    .setParameter("contentId", video.getContentId())
                    .getSingleResult();
            return new MyVideoDTO(video.getContentId(), video.getTitle(), (int) views, starRatingRepository.getAverage(video.getContentId()), video.getVisibility(), video.getQuestions().size(), video.getTags(), video.getColor(), video.isApproved());
        }).toList();
    }

    public List<MyLearningpathDTO> getUserLearningpaths(Long userId) {
        if (getById(userId) != null && getById(userId).getUserRole() == UserRoleEnum.CUSTOMER) {
            return null;
        }

        // getting all learning paths that are editable by the user
        List<LearningPath> learningPaths = em.createQuery("select lp from LearningPath lp" +
                        " where (lp.visibility = 'self' and lp.user.userId = :userId) or :isAdmin = true or lp.visibility != 'self'" +
                        " order by lp.contentId", LearningPath.class)
                .setParameter("userId", userId)
                .setParameter("isAdmin", getById(userId).getUserRole() == UserRoleEnum.ADMIN)
                .getResultList();

        return learningPaths.stream()
                .map(lp -> {
                    long views = em.createQuery("select count(vp) from ViewProgress vp where vp.content.contentId = :contentId", Long.class)
                            .setParameter("contentId", lp.getContentId())
                            .getSingleResult();

                    return new MyLearningpathDTO(
                            lp.getContentId(),
                            lp.getTitle(),
                            views,
                            lp.getVisibility(),
                            lp.getEntries().size(),
                            lp.getTags(),
                            lp.getColor(),
                            lp.isApproved());
                }).toList();
    }

    public User create(UserDTO user) {
        try{
            User createdUser = new User(user.username(), user.email(), user.password(), user.userRole());
            em.persist(createdUser);
            return createdUser;
        } catch(Exception e){
            return null;
        }
    }

    public User login(UserDTO userDTO) {
        try{
            User user = em.createQuery("select u from User u where u.email = :email", User.class)
                    .setParameter("email", userDTO.email()).getSingleResult();

            if (!user.verifyPassword(userDTO.password())) {
                return null;
            }

            return user;
        } catch(NoResultException e){
            return null;
        }
    }

    public User isLoggedIn(UserLoginDTO userLoginDTO) {
        try {
            User user = em.createQuery("select u from User u where u.userId = :userId", User.class)
                    .setParameter("userId", userLoginDTO.userId()).getSingleResult();
            if(user.verifyPassword(userLoginDTO.password())){
                return user;
            }
        } catch (NoResultException e) {
            return null;
        }
        return null;
    }

    //TODO @michi read this code and comment it, its currently a black box
    public UserTreeDTO getFullUserTree(Long userId) {
        // getting root user
        User rootUser = em.find(User.class, userId);
        if (rootUser == null) {
            return null;
        }

        // building up the tree starting from the root user
        UserTreeDTO dto = buildUserTreeDTO(rootUser, 0);

        // getting all subordinates of the root user (can contain duplicates)
        List<Long> subordinateUserIds = getSubordinates(dto);

        // getting all direct subordinates of the root user that are not in the subordinates already (could be: because of deputy supervisor)
        List<User> directSubordinates = em.createQuery("select u from User u " +
                        "where u.deputySupervisor.userId = :userId and u.userId not in (:userIds) and u.supervisor.id != :userId", User.class)
                .setParameter("userId", userId)
                .setParameter("userIds", subordinateUserIds)
                .getResultList();

        // convert the direct subordinates to DTOs
        List<UserTreeDTO> subordinateDtos = new ArrayList<>();
        for (User subordinate : directSubordinates) {
            dto.subordinates().add(new UserTreeDTO(subordinate.getUserId(), subordinate.getUsername(), subordinate.getEmail(), subordinate.getUserRole(), 0, null));
        }

        List<User> userWithoutSupervisor = em.createQuery(
                "select u from User u " +
                "where u.supervisor is null " +
                "and u.userRole = :rootUserRole"
            , User.class)
                .setParameter("rootUserRole", rootUser.getUserRole() == UserRoleEnum.ADMIN ? UserRoleEnum.EMPLOYEE : rootUser.getUserRole())
                .getResultList();
        for (User noSup : userWithoutSupervisor) {
            dto.subordinates().add(new UserTreeDTO(noSup.getUserId(), noSup.getUsername(), noSup.getEmail(), noSup.getUserRole(), 0, null));
        }

        return dto;
    }

    public List<Long> getSubordinates(UserTreeDTO user){
        List<Long> subordinates = new ArrayList<>();

        // adding current user
        subordinates.add(user.userId());

        // looping over his subordinates
        for(UserTreeDTO u : user.subordinates()){

            // adding the subordinates of the current user recosively
            subordinates.addAll(getSubordinates(u));
        }
        return subordinates;
    }

    public UserTreeDTO buildUserTreeDTO(User user, int level) {
        // getting direct subordinates of the current user
        List<User> directSubordinates = em.createQuery("select u from User u " +
                        "where u.supervisor.userId = :userId", User.class)
                .setParameter("userId", user.getUserId())
                .getResultList();

        // loop over the direct subordinates
        List<UserTreeDTO> subordinateDtos = new ArrayList<>();
        for (User subordinate : directSubordinates) {
            // recursively build the tree for each direct subordinate
            subordinateDtos.add(buildUserTreeDTO(subordinate, level + 1));
        }

        return new UserTreeDTO(user.getUserId(), user.getUsername(), user.getEmail(), user.getUserRole(), level, subordinateDtos);
    }

    public List<UserAssignedContentDTO> getUserAssignedContent(Long userId) {
        try {
            List<Content> contents = em.createQuery("select c from Content c " +
                            "join ContentAssignment ca on ca.content.contentId = c.contentId where ca.assignedTo.userId = :userId " +
                            "order by ca.timestamp desc", Content.class)
                    .setParameter("userId", userId).getResultList();

            List<UserAssignedContentDTO> dtos = new LinkedList<>();
            for (Content content : contents) {
                dtos.add(convertContentToAssignDTO(content, userId));
            }

            return dtos;
        } catch (Exception e) {
            return null;
        }
    }

    public UserAssignedContentDTO convertContentToAssignDTO(Content content, Long userId){
        int progress;
        try{
            progress = em.createQuery("select vp.progress from ViewProgress vp " +
                            "where vp.user.userId = :userId and vp.content.contentId = :contentId", Integer.class)
                    .setParameter("userId", userId).setParameter("contentId", content.getContentId()).getSingleResult();
        } catch(NoResultException e){
            progress = 0;
        }

        boolean isFinished;

        try{
            isFinished = em.createQuery("select ca.isFinished from ContentAssignment ca " +
                            "where ca.assignedTo.userId = :userId and ca.content.contentId = :contentId", Boolean.class)
                    .setParameter("userId", userId).setParameter("contentId", content.getContentId()).getSingleResult();
        } catch(NoResultException e){
            isFinished = false;
        }

        double progressPercentage = 0;
        if(content instanceof Video && progress > 0){
            Video video = (Video) content;
            if(video.getVideoFile() != null){
                progressPercentage = (double) progress / video.getVideoFile().getDurationSeconds();
            }
        } else if(progress > 0) {
            progressPercentage = progress;
        }

        int questionOrVideoCount = 0;
        if(content instanceof LearningPath){
            LearningPath learningPath = (LearningPath) content;
            questionOrVideoCount = learningPath.getEntries().size();
        } else if (content instanceof Video){
            Video video = (Video) content;
            questionOrVideoCount = video.getQuestions().size();
        }


        return new UserAssignedContentDTO(
                content.getContentId(),
                content.getTitle(),
                content instanceof Video ? "Video" : "LearningPath",
                progressPercentage,
                questionOrVideoCount,
                content.getColor(),
                isFinished
            );
    }

    public UserAssignedContentDTO assignContent(Long userId, Long assignToUserId, Long contentId) {
        User user = getById(userId);
        User assignToUser = getById(assignToUserId);
        Content content = em.find(Content.class, contentId);

        ContentAssignment contentAssignment = new ContentAssignment(user, assignToUser, content);
        em.persist(contentAssignment);

        ContentNotification notification = new ContentNotification(assignToUser, user, content, ContentNotificationEnum.assignment);
        em.persist(notification);
        notificationRepository.sendConfirmationEmail(notification);

        return convertContentToAssignDTO(content, assignToUserId);
    }

    public void unassignContent(Long userId, Long contentId) {
        try{
            ContentAssignment contentAssignment = em.createQuery("select ca from ContentAssignment ca " +
                            "where ca.assignedTo.userId = :userId and ca.content.contentId = :contentId", ContentAssignment.class)
                    .setParameter("userId", userId)
                    .setParameter("contentId", contentId)
                    .getSingleResult();
            em.remove(contentAssignment);
        } catch(NoResultException e){
            log.error("No content assignment found for user with id " + userId + " and content with id " + contentId);
        }
    }

    public void finishAssignedContent(Long userId, Long contentId) {
        try{
            ContentAssignment contentAssignment = em.createQuery("select ca from ContentAssignment ca " +
                            "where ca.assignedTo.userId = :userId and ca.content.contentId = :contentId", ContentAssignment.class)
                    .setParameter("userId", userId)
                    .setParameter("contentId", contentId)
                    .getSingleResult();
            contentAssignment.setFinished(true);
            em.merge(contentAssignment);
        } catch(NoResultException e){}
    }

    public boolean isAllowed(Long userId, Long contentId) {
        try{
            Content content = em.createQuery("select c from Content c where c.contentId = :contentId", Content.class)
                    .setParameter("contentId", contentId).getSingleResult();

            return content.isVisibleForUser(getById(userId));
        } catch(NoResultException e){
            return false;
        }
    }

    public UserStatisticsDTO getStatistics(Long userId) {
        User user = getById(userId);

        long totalComments;
        try {
            totalComments = em.createQuery("select count(c) from Comment c where c.user.userId = :userId", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalComments = 0;
        }

        long totalRatings;
        try {
            totalRatings = em.createQuery("select count(sr) from StarRating sr where sr.user.userId = :userId", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalRatings = 0;
        }

        double avgRating;
        try {
            avgRating = em.createQuery("select avg(sr.rating) from StarRating sr where sr.user.userId = :userId", Double.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (Exception e) {
            avgRating = -1;
        }

        long totalQuizzes;
        try {
            totalQuizzes = em.createQuery("select count(q) from QuizResult q where q.user.userId = :userId", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalQuizzes = 0;
        }

        long totalVideosWatched;
        try {
            totalVideosWatched = em.createQuery("select count(distinct vp) from ViewProgress vp" +
                            " join Video c on vp.content.contentId = c.contentId" +
                            " join VideoFile v on c.videoFile.videoFileId = v.videoFileId" +
                            " where vp.user.userId = :userId and vp.progress > 0", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalVideosWatched = 0;
        }

        long totalLearningPathsCompleted;
        try {
            totalLearningPathsCompleted = em.createQuery("select count(distinct vp) from ViewProgress vp " +
                            "join LearningPath lp on lp.contentId = vp.content.contentId " +
                            "where vp.user.userId = :userId and " +
                            "vp.progress = (select count(e) from LearningPath p join p.entries e where p.contentId = lp.contentId)", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalLearningPathsCompleted = 0;
        }

        long totalContentSaved;
        try {
            totalContentSaved = em.createQuery("select count(c) from User u join u.savedContent c where u.userId = :userId", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalContentSaved = 0;
        }

        long totalVideosUploaded;
        try {
            totalVideosUploaded = em.createQuery("select count(v) from Video v where v.user.userId = :userId", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalVideosUploaded = 0;
        }

        long totalLearningPathsUploaded;
        try {
            totalLearningPathsUploaded = em.createQuery("select count(lp) from LearningPath lp where lp.user.userId = :userId", Long.class)
                    .setParameter("userId", userId).getSingleResult();
        } catch (NoResultException e) {
            totalLearningPathsUploaded = 0;
        }

        return new UserStatisticsDTO(user, (int) totalComments, (int) totalRatings, avgRating, (int) totalQuizzes, (int) totalVideosWatched,
                (int) totalLearningPathsCompleted, (int) totalContentSaved, (int) totalVideosUploaded, (int) totalLearningPathsUploaded);
    }
}