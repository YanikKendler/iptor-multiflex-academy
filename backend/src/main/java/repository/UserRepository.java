package repository;

import dtos.ContentForUserDTO;
import dtos.VideoOverviewDTO;
import dtos.ContentForUserDTO;
import dtos.VideoAndLearningPathOverviewCollection;
import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.transaction.Transactional;
import model.Tag;
import model.User;
import model.Video;
import model.ViewProgress;

import javax.swing.text.View;
import java.util.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
                new VideoAndLearningPathOverviewCollection(getCurrentVideos(userId), List.of()),
                new VideoAndLearningPathOverviewCollection(getAssignedVideos(userId), List.of()),
                new VideoAndLearningPathOverviewCollection(getSuggestedVideos(userId), List.of()));
    }

    public List<VideoOverviewDTO> getCurrentVideos(Long userId) {
        // Fetch unfinished videos
        List<Video> unfinishedVideos = em.createQuery(
                        "select distinct v from ViewProgress vp " +
                                "join Video v on v.contentId = vp.content.contentId " +
                                "where vp.user.userId = :userId and vp.ignored = false " +
                                "and vp.durationSeconds < v.videoFile.durationSeconds * 0.90", Video.class)
                .setParameter("userId", userId)
                .getResultList();

        // Fetch saved videos
        List<Video> savedVideos = em.createQuery(
                        "select sv from User u " +
                                "join u.savedVideos sv " +
                                "where u.userId = :userId", Video.class)
                .setParameter("userId", userId)
                .getResultList();

        // Combine both lists
        Set<Video> combinedVideos = new HashSet<>(unfinishedVideos);
        combinedVideos.addAll(savedVideos);

        // Convert to VideoOverviewDTO
        return combinedVideos.stream()
                .map(video -> {return convertVideoToOverviewDTO(video, userId);})
                .collect(Collectors.toList());
    }

    public List<VideoOverviewDTO> getAssignedVideos (Long userId){
        List<Video> assignedVideos = em.createQuery("select distinct v from Video v " +
                "join ContentAssignment va on va.content.contentId = v.contentId " +
                "where va.assignedTo.userId = :userId", Video.class).setParameter("userId", userId).getResultList();

        return assignedVideos.stream().map(video -> {return convertVideoToOverviewDTO(video, userId);}).toList();
    }

    public List<VideoOverviewDTO> getSuggestedVideos (Long userId){
        // get all tags of the users watched videos
        List<Tag> tags = em.createQuery("select distinct t from Video v " +
                        "join ViewProgress vp on vp.content.contentId = v.contentId " +
                        "join v.tags t " +
                        "where vp.user.userId = :userId", Tag.class)
                .setParameter("userId", userId).getResultList();

        List<Long> savedVideos = em.createQuery("select v.contentId from User u " +
                        "join u.savedVideos v " +
                        "where u.userId = :userId", Long.class)
                .setParameter("userId", userId).getResultList();

        List<Video> videos;
        if (savedVideos.isEmpty()) {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId)", Video.class)
                    .setParameter("userId", userId)
                    .getResultList();
        } else {
            videos = em.createQuery(
                            "select v from Video v " +
                                    "where v.contentId not in " +
                                    "(select vp.content.contentId from ViewProgress vp where vp.user.userId = :userId) and " +
                                    "v.contentId not in :savedVideos", Video.class)
                    .setParameter("userId", userId)
                    .setParameter("savedVideos", savedVideos)
                    .getResultList();
        }

        HashMap<Video, Integer> videoScores = new HashMap<>();
        videos.forEach(video -> {
            double avgStarRating = starRatingRepository.getAverage(video.getContentId());
            double tagScore = video.getTags().stream().mapToDouble(tag -> tags.contains(tag) ? 1 : 0).sum();

            videoScores.put(video, (int) (avgStarRating + tagScore*2.5));
        });

        // sort by score
        List<Map.Entry<Video, Integer>> sortedEntries = videoScores.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByValue())
                .collect(Collectors.toList());

        Collections.reverse(sortedEntries);

        // parse it into the video overview dto
        return sortedEntries.stream().map(entry -> convertVideoToOverviewDTO(entry.getKey(), userId)).toList();
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
        } catch (NoResultException e) {
            viewProgress = null;
        }

        if (video.getVideoFile() != null) {
            return new VideoOverviewDTO(video.getContentId(), video.getTitle(), video.getDescription(), video.getTags(), video.getColor(), video.getVideoFile().getDurationSeconds(), viewProgress);
        }
        return new VideoOverviewDTO(video.getContentId(), video.getTitle(), video.getDescription(), video.getTags(), video.getColor(), null, viewProgress);
    }

    public void toggleSavedVideo(Long userId, Long videoId) {
        User user = getById(userId);
        user.toggleSavedVideo(videoRepository.getById(videoId));
        em.merge(user);
    }

    public boolean isVideoSaved(Long userId, Long videoId) {
        User user = getById(userId);
        return user.getSavedVideos().stream().anyMatch(video -> video.getContentId().equals(videoId));
    }
}
