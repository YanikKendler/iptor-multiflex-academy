package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Tag;
import model.Video;

import java.util.List;

@ApplicationScoped
public class TagRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void create(Long videoId, Tag tag) {
        Video video = videoRepository.getById(videoId);
        video.addTag(tag);
        em.persist(tag);
    }

    @Transactional
    public void update(Tag tag) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    @Transactional
    public List<Tag> getAll(Long videoId) {
        return em.createQuery("select t from Video v join v.tags t where v.videoId = :videoId", Tag.class)
                .setParameter("videoId", videoId)
                .getResultList();
    }

    public Tag getById(Long id){
        return em.find(Tag.class, id);
    }
}
