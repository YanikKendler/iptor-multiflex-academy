package repository;

import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Tag;
import model.User;
import model.Video;

import java.util.LinkedList;
import java.util.List;

@ApplicationScoped
public class UserRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void toggleSavedVideo(Long userId, Long videoId) {
        User user = getById(userId);
        user.toggleSavedVideo(videoRepository.getById(videoId));
        em.merge(user);
    }

    public User getById(Long id) {
        return em.find(User.class, id);
    }

    public boolean isVideoSaved(Long userId, Long videoId) {
        User user = getById(userId);
        return user.getSavedVideos().stream().anyMatch(video -> video.getVideoId().equals(videoId));
    }

    public List<VideoOverviewDTO> getSuggestedVideos(Long userId) {
        // this statement provides a list of videos that have tags in common with the videos the user has watched
        // and that have not been watched by the user yet
        List<Video> suggestedVideos = em.createQuery("select distinct v from Video v " +
                "join ViewProgress vp on vp.video = v " +
                "join v.tags t " +
                "where vp.user.userId = :userId and t in (" +
                    "select t from Video v2 " +
                    "join ViewProgress vp2 on v2.videoId = vp2.video.videoId " +
                    "join v2.tags t2 " +
                    "where vp2.user.userId = :userId)", Video.class)
                .setParameter("userId", userId).getResultList();

        return suggestedVideos.stream()
                .map(v -> new VideoOverviewDTO(
                        v.getVideoId(),
                        v.getTitle(),
                        v.getDescription(),
                        v.getTags(),
                        v.getColor(),
                        v.getVideoFile() != null ? v.getVideoFile().getDurationSeconds() : null
                ))
                .toList();
    }
}
