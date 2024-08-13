package repository;

import dtos.VideoForUserDTO;
import dtos.VideoOverviewDTO;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Video;

import java.util.List;

@ApplicationScoped
public class VideoRepository {
    @Inject
    EntityManager em;

    @Transactional
    public void create(Video video) {
        em.persist(video);
    }

    @Transactional
    public void update(Video video) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<Video> getAll() {
        return em.createQuery("select v from Video v", Video.class).getResultList();
    }

    @Transactional
    public VideoForUserDTO getAllFromUser(Long userId) {
        List<VideoOverviewDTO> continueVideos = null;
        List<VideoOverviewDTO> assignedVideos = null;
        List<VideoOverviewDTO> suggestedVideos = null;

        try {
            continueVideos = em.createQuery("select new dtos.VideoOverviewDTO(v.videoId as videoId, v.title as title, v.description as description, v.tags as tags, v.color as color, v.durationSeconds as durationSeconds, vp as progress)" +
                            " from Video v join ViewProgress vp on v.id = vp.video.id where vp.user.userId = :userId", VideoOverviewDTO.class)
                    .setParameter("userId", userId).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }

        try {
            assignedVideos = em.createQuery("select new dtos.VideoOverviewDTO(v.videoId as videoId, v.title as title, v.description as description, v.tags as tags, v.color as color, v.durationSeconds as durationSeconds, vp as progress)" +
                            " from Video v join VideoAssignment va on v.id = va.video.id" +
                            " join ViewProgress  vp on v.id = vp.video.id where va.assignedTo.userId = :userId", VideoOverviewDTO.class)
                    .setParameter("userId", userId).getResultList();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new VideoForUserDTO(continueVideos, assignedVideos, suggestedVideos);
    }

    public Video getById(Long id) {
        return em.find(Video.class, id);
    }
}