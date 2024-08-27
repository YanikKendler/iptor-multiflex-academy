package repository;

import dtos.*;
import dtos.ContentForUserDTO;
import dtos.VideoOverviewDTO;
import enums.ContentNotificationEnum;
import io.quarkus.datasource.runtime.DataSourcesBuildTimeConfig;
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
    VideoRepository videoRepository;

    @Inject
    StarRatingRepository starRatingRepository;
    @Inject
    DataSourcesBuildTimeConfig dataSourcesBuildTimeConfig;

    public User getById(Long id) {
        return em.find(User.class, id);
    }

    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<User> getAll() {
        return em.createQuery("select u from User u", User.class).getResultList();
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
        List<Video> unfinishedVideos = em.createQuery(
                        "select distinct v from ViewProgress vp " +
                                "join Video v on v.contentId = vp.content.contentId " +
                                "join v.tags vt " +
                                "where vp.user.userId = :userId and vp.ignored = false " +
                                "and vp.progress < v.videoFile.durationSeconds * 0.90 " +
                                "and not exists (" +
                                "    select t from Tag t " +
                                "    where t in :tags and t not in elements(v.tags)" +
                                ")", Video.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .getResultList();

        // Fetch saved content
        List<Content> savedContent = em.createQuery(
                        "select distinct sv from User u " +
                                "join u.savedContent sv " +
                                "join sv.tags vt " +
                                "where u.userId = :userId " +
                                "and not exists (" +
                                "    select t from Tag t " +
                                "    where t in :tags and t not in elements(sv.tags)" +
                                ")", Content.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
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

        // Convert to VideoOverviewDTO
        List<VideoOverviewDTO> currentVideos = combinedVideos.stream()
                .map(video -> convertVideoToOverviewDTO(video, userId)).toList();

        // Fetch unfinished learning paths
        List<LearningPath> unfinishedLearningPaths = em.createQuery(
                        "select distinct lp from ViewProgress vp " +
                                "join LearningPath lp on lp.contentId = vp.content.contentId " +
                                "join lp.tags t " +
                                "where vp.user.userId = :userId and vp.ignored = false and vp.progress < " +
                                "(select count(e) from lp.entries e) " +
                                "and not exists (" +
                                "    select t from Tag t " +
                                "    where t in :tags and t not in elements(lp.tags)" +
                                ")", LearningPath.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .getResultList();

        // Combine unfinished and saved learning paths
        Set<LearningPath> combinedLearningPaths = new HashSet<>(unfinishedLearningPaths);
        combinedLearningPaths.addAll(savedLearningPaths);

        // Convert to LearningPathOverviewDTO
        List<LearningPathOverviewDTO> currentLearningPaths = combinedLearningPaths.stream()
                .map(learningPath -> convertLearningPathToOverviewDTO(learningPath, userId)).toList();

        return new VideoAndLearningPathOverviewCollection(currentVideos, currentLearningPaths);
    }

    public VideoAndLearningPathOverviewCollection getAssignedContent(Long userId, List<Tag> tags) {
        List<Video> assignedVideos = em.createQuery("select distinct v from Video v " +
                        "join ContentAssignment va on va.content.contentId = v.contentId " +
                        "join v.tags t " +
                        "where va.assignedTo.userId = :userId and va.isFinished = false " +
                        "and not exists (" +
                        "    select t from Tag t " +
                        "    where t in :tags and t not in elements(v.tags)" +
                        ")", Video.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .getResultList();

        List<VideoOverviewDTO> assignedVideosDTO = assignedVideos.stream()
                .map(video -> convertVideoToOverviewDTO(video, userId)).toList();

        List<LearningPath> assignedLearningPaths = em.createQuery("select distinct lp from LearningPath lp " +
                        "join ContentAssignment va on va.content.contentId = lp.contentId " +
                        "join lp.tags t " +
                        "where va.assignedTo.userId = :userId and va.isFinished = false " +
                        "and not exists (" +
                        "    select t from Tag t " +
                        "    where t in :tags and t not in elements(lp.tags)" +
                        ")", LearningPath.class)
                .setParameter("userId", userId)
                .setParameter("tags", tags)
                .getResultList();

        List<LearningPathOverviewDTO> assignedLearningPathsDTO = assignedLearningPaths.stream()
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

        List<Long> savedContent = em.createQuery("select c.contentId from User u " +
                        "join u.savedContent c " +
                        "join c.tags t " +
                        "where u.userId = :userId ", Long.class)
                .setParameter("userId", userId).getResultList();

        List<Video> videos;
        List<LearningPath> learningPaths;
        if (savedContent.isEmpty()) {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "join v.tags t " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId and ignored = false) " +
                                    "and not exists(" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(v.tags)" +
                                    ")", Video.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .getResultList();

            learningPaths = em.createQuery(
                            "select lp from LearningPath lp " +
                                    "join lp.tags t " +
                                    "where lp.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId and ignored = false) " +
                                    "and not exists(" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(lp.tags)" +
                                    ")", LearningPath.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .getResultList();
        } else {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "join v.tags t " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId) and " +
                                    "v.contentId not in :savedContent " +
                                    "and not exists(" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(v.tags)" +
                                    ")", Video.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .setParameter("savedContent", savedContent)
                    .getResultList();

            learningPaths = em.createQuery(
                            "select lp from LearningPath lp " +
                                    "join lp.tags t " +
                                    "where lp.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId) and " +
                                    "lp.contentId not in :savedVideos " +
                                    "and not exists(" +
                                    "    select t from Tag t " +
                                    "    where t in :tags and t not in elements(lp.tags)" +
                                    ")", LearningPath.class)
                    .setParameter("userId", userId)
                    .setParameter("tags", filterTags)
                    .setParameter("savedVideos", savedContent)
                    .getResultList();
        }

        HashMap<Video, Integer> videoScores = new HashMap<>();
        HashMap<LearningPath, Integer> learningPathScores = new HashMap<>();

        User user = em.find(User.class, userId);
        videos.forEach(video -> {
            if(video.isVisibleForUser(user)){
                double avgStarRating = starRatingRepository.getAverage(video.getContentId());
                double tagScore = video.getTags().stream().mapToDouble(tag -> tags.contains(tag) ? 1 : 0).sum();

                videoScores.put(video, (int) (avgStarRating + tagScore*2.5));
            }
        });

        learningPaths.forEach(learningPath -> {
            if(learningPath.isVisibleForUser(user)){

                double avgStarRating = starRatingRepository.getAverage(learningPath.getContentId());
                double tagScore = learningPath.getTags().stream().mapToDouble(tag -> tags.contains(tag) ? 1 : 0).sum();

                learningPathScores.put(learningPath, (int) (avgStarRating + tagScore*2.5));
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
        List<Video> videos = em.createQuery("select v from Video v where v.user.userId = :userId order by v.contentId", Video.class)
                .setParameter("userId", userId)
                .getResultList();

        return videos.stream().map(video -> {
            long views = em.createQuery("select count(vp) from ViewProgress vp where vp.content.contentId = :contentId", Long.class)
                    .setParameter("contentId", video.getContentId())
                    .getSingleResult();
            return new MyVideoDTO(video.getContentId(), video.getTitle(), (int) views, starRatingRepository.getAverage(video.getContentId()), video.getVisibility(), video.getQuestions().size(), video.getTags(), video.getColor());
        }).toList();
    }

    public List<MyLearningpathDTO> getUserLearningpaths(Long userId) {
        TypedQuery<LearningPath> query = em.createQuery(
                "SELECT l FROM LearningPath l WHERE l.user.userId = :userId ORDER BY l.contentId",
                LearningPath.class);
        query.setParameter("userId", userId);
        List<LearningPath> learningPaths = query.getResultList();

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
                            lp.getColor());
                }).toList();
    }

    public Long create(UserDTO user) {
        User createdUser = new User(user.username(), user.email(), user.password(), user.userRole());
        em.persist(createdUser);
        return createdUser.getUserId();
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

    @Transactional
    public UserTreeDTO getFullUserTree(Long userId) {
        User rootUser = em.find(User.class, userId);
        if (rootUser == null) {
            return null;
        }
        UserTreeDTO dto = buildUserTreeDTO(rootUser, 0);

        List<Long> userIds = getSubordinates(dto);
        List<User> directSubordinates = em.createQuery("select u from User u " +
                        "where u.deputySupervisor.userId = :userId and u.userId not in (:userIds) and u.supervisor.id != :userId", User.class)
                .setParameter("userId", userId)
                .setParameter("userIds", userIds)
                .getResultList();

        List<UserTreeDTO> subordinateDtos = new ArrayList<>();
        for (User subordinate : directSubordinates) {
            subordinateDtos.add(new UserTreeDTO(subordinate.getUserId(), subordinate.getUsername(), 0, null));
        }

        dto.subordinates().addAll(subordinateDtos);
        return dto;
    }

    public List<Long> getSubordinates(UserTreeDTO user){
        List<Long> subordinates = new ArrayList<>();
        subordinates.add(user.userId());
        for(UserTreeDTO u : user.subordinates()){
            subordinates.addAll(getSubordinates(u));
        }
        return subordinates;
    }

    public UserTreeDTO buildUserTreeDTO(User user, int level) {
        List<User> directSubordinates = em.createQuery("select u from User u " +
                        "where u.supervisor.userId = :userId", User.class)
                .setParameter("userId", user.getUserId())
                .getResultList();

        List<UserTreeDTO> subordinateDtos = new ArrayList<>();
        for (User subordinate : directSubordinates) {
            subordinateDtos.add(buildUserTreeDTO(subordinate, level + 1));
        }

        return new UserTreeDTO(user.getUserId(), user.getUsername(), level, subordinateDtos);
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

        boolean isFinished = em.createQuery("select ca.isFinished from ContentAssignment ca " +
                        "where ca.assignedTo.userId = :userId and ca.content.contentId = :contentId", Boolean.class)
                .setParameter("userId", userId).setParameter("contentId", content.getContentId()).getSingleResult();

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

        em.persist(new ContentNotification(assignToUser, user, content, ContentNotificationEnum.assignment));

        return convertContentToAssignDTO(content, userId);
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
}