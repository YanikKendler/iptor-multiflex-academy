package repository;

import dtos.*;
import dtos.ContentForUserDTO;
import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import model.*;

import java.util.*;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
@Transactional
public class UserRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Inject
    StarRatingRepository starRatingRepository;

    public User getById(Long id) {
        return em.find(User.class, id);
    }

    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<User> getAll() {
        return em.createQuery("select u from User u", User.class).getResultList();
    }

    public ContentForUserDTO getContentForUser(Long userId) {
        return new ContentForUserDTO(
                getCurrentContent(userId),
                getAssignedContent(userId),
                getSuggestedContent(userId)
        );
    }

    public VideoAndLearningPathOverviewCollection getCurrentContent(Long userId) {
        // Fetch unfinished videos
        List<Video> unfinishedVideos = em.createQuery(
                        "select distinct v from ViewProgress vp " +
                                "join Video v on v.contentId = vp.content.contentId " +
                                "where vp.user.userId = :userId and vp.ignored = false " +
                                "and vp.progress < v.videoFile.durationSeconds * 0.90", Video.class)
                .setParameter("userId", userId)
                .getResultList();

        // Fetch saved content
        List<Content> savedContent = em.createQuery(
                        "select sv from User u " +
                                "join u.savedContent sv " +
                                "where u.userId = :userId", Content.class)
                .setParameter("userId", userId)
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
                                "where vp.user.userId = :userId and vp.ignored = false and vp.progress < " +
                                "(select count(e) from lp.entries e)", LearningPath.class)
                .setParameter("userId", userId)
                .getResultList();

        // Combine unfinished and saved learning paths
        Set<LearningPath> combinedLearningPaths = new HashSet<>(unfinishedLearningPaths);
        combinedLearningPaths.addAll(savedLearningPaths);

        // Convert to LearningPathOverviewDTO
        List<LearningPathOverviewDTO> currentLearningPaths = combinedLearningPaths.stream()
                .map(learningPath -> convertLearningPathToOverviewDTO(learningPath, userId)).toList();

        return new VideoAndLearningPathOverviewCollection(currentVideos, currentLearningPaths);
    }

    public VideoAndLearningPathOverviewCollection getAssignedContent (Long userId){
        List<Video> assignedVideos = em.createQuery("select distinct v from Video v " +
                "join ContentAssignment va on va.content.contentId = v.contentId " +
                "where va.assignedTo.userId = :userId", Video.class).setParameter("userId", userId).getResultList();

        List<VideoOverviewDTO> assignedVideosDTO = assignedVideos.stream().map(video -> {return convertVideoToOverviewDTO(video, userId);}).toList();

        List<LearningPath> assignedLearningPaths = em.createQuery("select distinct lp from LearningPath lp " +
                "join ContentAssignment va on va.content.contentId = lp.contentId " +
                "where va.assignedTo.userId = :userId", LearningPath.class).setParameter("userId", userId).getResultList();

        List<LearningPathOverviewDTO> assignedLearningPathsDTO = assignedLearningPaths.stream().map(learningPath -> {return convertLearningPathToOverviewDTO(learningPath, userId);}).toList();

        return new VideoAndLearningPathOverviewCollection(assignedVideosDTO, assignedLearningPathsDTO);
    }

    public VideoAndLearningPathOverviewCollection getSuggestedContent(Long userId){
        // get all tags of the users watched videos and learning paths
        List<Tag> tags = em.createQuery("select distinct t from Video v " +
                        "join ViewProgress vp on vp.content.contentId = v.contentId " +
                        "join v.tags t " +
                        "where vp.user.userId = :userId", Tag.class)
                .setParameter("userId", userId).getResultList();

        List<Long> savedContent = em.createQuery("select c.contentId from User u " +
                        "join u.savedContent c " +
                        "where u.userId = :userId", Long.class)
                .setParameter("userId", userId).getResultList();

        List<Video> videos;
        List<LearningPath> learningPaths;
        if (savedContent.isEmpty()) {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId and ignored = false)", Video.class)
                    .setParameter("userId", userId)
                    .getResultList();

            learningPaths = em.createQuery(
                            "select lp from LearningPath lp " +
                                    "where lp.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId and ignored = false)", LearningPath.class)
                    .setParameter("userId", userId)
                    .getResultList();
        } else {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId) and " +
                                    "v.contentId not in :savedContent", Video.class)
                    .setParameter("userId", userId)
                    .setParameter("savedContent", savedContent)
                    .getResultList();

            learningPaths = em.createQuery(
                            "select lp from LearningPath lp " +
                                    "where lp.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId) and " +
                                    "lp.contentId not in :savedVideos", LearningPath.class)
                    .setParameter("userId", userId)
                    .setParameter("savedVideos", savedContent)
                    .getResultList();
        }

        HashMap<Video, Integer> videoScores = new HashMap<>();
        HashMap<LearningPath, Integer> learningPathScores = new HashMap<>();

        videos.forEach(video -> {
            double avgStarRating = starRatingRepository.getAverage(video.getContentId());
            double tagScore = video.getTags().stream().mapToDouble(tag -> tags.contains(tag) ? 1 : 0).sum();

            videoScores.put(video, (int) (avgStarRating + tagScore*2.5));
        });

        learningPaths.forEach(learningPath -> {
            double avgStarRating = starRatingRepository.getAverage(learningPath.getContentId());
            double tagScore = learningPath.getTags().stream().mapToDouble(tag -> tags.contains(tag) ? 1 : 0).sum();

            learningPathScores.put(learningPath, (int) (avgStarRating + tagScore*2.5));
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
            return new VideoOverviewDTO(video.getContentId(), video.getTitle(), video.getDescription(), video.getTags(), saved, video.getColor(), video.getVideoFile().getDurationSeconds(), viewProgress);
        }
        return new VideoOverviewDTO(video.getContentId(), video.getTitle(), video.getDescription(), video.getTags(), saved, video.getColor(), null, viewProgress);
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
}