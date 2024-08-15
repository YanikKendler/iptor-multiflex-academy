package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.User;

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
}
