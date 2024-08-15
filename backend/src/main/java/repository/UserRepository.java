package repository;

import dtos.ContentForUserDTO;
import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Employee;
import model.User;

import java.util.List;
import java.util.stream.Stream;

@ApplicationScoped
@Transactional
public class UserRepository {
    @Inject
    EntityManager em;

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
}
