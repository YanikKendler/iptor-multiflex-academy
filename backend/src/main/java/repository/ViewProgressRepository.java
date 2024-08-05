package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Tag;
import model.Video;
import model.ViewProgress;

import java.util.List;

@ApplicationScoped
public class ViewProgressRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void create(Long videoId, ViewProgress progress) {
        Video video = videoRepository.getById(videoId);
        progress.setVideo(video);
        em.persist(progress);
    }

    @Transactional
    public void update(ViewProgress progress) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    @Transactional
    public List<Tag> getAll() {
        return em.createQuery("select p from ViewProgress p", Tag.class).getResultList();
    }

    public ViewProgress getById(Long id){
        return em.find(ViewProgress.class, id);
    }
}
