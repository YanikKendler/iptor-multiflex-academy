package repository;

import dtos.ContentForUserDTO;
import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.User;
import model.Video;

import java.util.LinkedList;
import java.util.List;

import java.util.List;
import java.util.stream.Stream;

@ApplicationScoped
@Transactional
public class UserRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

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
        List<VideoOverviewDTO> unfinishedVideos = em.createQuery(
                "select new dtos.VideoOverviewDTO(v.id, v.title, v.description, v.tags, v.color, v.videoFile.durationSeconds) " +
                "from ViewProgress vp " +
                "join Video v on v.contentId = vp.progressId " +
                "where vp.user.userId = :userId "
            , VideoOverviewDTO.class)
            .setParameter("userId", userId)
            .setMaxResults(10)
            .getResultList();

        List<VideoOverviewDTO> savedVideos = em.createQuery(
                "select new dtos.VideoOverviewDTO(sv.id, sv.title, sv.description, sv.tags, sv.color, sv.videoFile.durationSeconds) " +
                "from User.savedVideos sv " +
                "where User.userId = :userId", VideoOverviewDTO.class)
            .setParameter("userId", userId)
            .getResultList();

        List<VideoOverviewDTO> currentVideos = Stream.concat(unfinishedVideos.stream(), savedVideos.stream()).toList();

        return null;
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

    public List<VideoOverviewDTO> getSuggestedVideos(Long userId) {
        // this statement provides a list of videos that have tags in common with the videos the user has watched
        // and that have not been watched by the user yet
        List<Video> suggestedVideos = em.createQuery("select distinct v from Video v " +
                "join ViewProgress vp on vp.content = v " +
                "join v.tags t " +
                "where vp.user.userId = :userId and t in (" +
                    "select t from Video v2 " +
                    "join ViewProgress vp2 on v2.contentId = vp2.content.contentId " +
                    "join v2.tags t2 " +
                    "where vp2.user.userId = :userId)", Video.class)
                .setParameter("userId", userId).getResultList();

        return suggestedVideos.stream()
                .map(v -> new VideoOverviewDTO(
                        v.getContentId(),
                        v.getTitle(),
                        v.getDescription(),
                        v.getTags(),
                        v.getColor(),
                        v.getVideoFile() != null ? v.getVideoFile().getDurationSeconds() : null
                ))
                .toList();
    }
}
