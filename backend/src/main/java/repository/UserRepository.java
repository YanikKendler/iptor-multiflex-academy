package repository;

import dtos.*;
import dtos.ContentForUserDTO;
import dtos.VideoOverviewDTO;
import io.quarkus.datasource.runtime.DataSourcesBuildTimeConfig;
import io.quarkus.elytron.security.common.BcryptUtil;
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
import java.util.stream.Collectors;

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
                        "where va.assignedTo.userId = :userId " +
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
                        "where va.assignedTo.userId = :userId " +
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
        User createdUser = new User(user.username(), user.email(), user.password(), user.userType());
        em.persist(createdUser);
        return createdUser.getUserId();
    }

    public Long login(UserDTO user) {
        try{
            User createdUser = em.createQuery("select u from User u where u.email = :email", User.class)
                    .setParameter("email", user.email()).getSingleResult();

            if (!createdUser.verifyPassword(user.password())) {
                return -1L;
            }
            return createdUser.getUserId();
        } catch(NoResultException e){
            return -2L;
        }
    }

    public boolean isLoggedIn(UserLoginDTO user1) {
        try {
            User user = em.createQuery("select u from User u where u.userId = :userId", User.class)
                    .setParameter("userId", user1.userId()).getSingleResult();
            return user.verifyPassword(user1.password());
        } catch (NoResultException e) {
            return false;
        }
    }

    public List<User> getUsers(Long userId) {
        try {
            return em.createQuery("select u from User u where u.supervisor.userId = :userId or u.deputySupervisor.userId = :userId", User.class)
                    .setParameter("userId", userId)
                    .getResultList();
        } catch(NoResultException e){
            return null;
        }
    }

    public List<UserAssignedContentDTO> getUserAssignedContent(Long userId) {
        try{
            List<Content> contents = em.createQuery("select c from Content c " +
                            "join ContentAssignment ca on ca.content.contentId = c.contentId where ca.assignedTo.userId = :userId", Content.class)
                    .setParameter("userId", userId).getResultList();

            List<UserAssignedContentDTO> dtos = new LinkedList<>();
            contents.forEach(content -> {
                int progress;
                try{
                    progress = em.createQuery("select vp.progress from ViewProgress vp " +
                                    "where vp.user.userId = :userId and vp.content.contentId = :contentId", Integer.class)
                            .setParameter("userId", userId).setParameter("contentId", content.getContentId()).getSingleResult();
                } catch(NoResultException e){
                    progress = 0;
                }


                System.out.println(content.getTitle());
                double progressPercentage = 0;
                System.out.println(progress);
                if(content instanceof Video && progress > 0){
                    Video video = (Video) content;
                    if(video.getVideoFile() != null){
                        progressPercentage = (double) progress / video.getVideoFile().getDurationSeconds();
                    }
                } else if(progress > 0) {
                    LearningPath learningPath = (LearningPath) content;
                    progressPercentage = (double) progress / learningPath.getEntries().size() / progress;
                }

                System.out.println(progressPercentage);
                dtos.add(new UserAssignedContentDTO(content.getContentId(), content.getTitle(), progressPercentage));
            });

            return dtos;
        } catch(Exception e){
            return null;
        }
    }
}