package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.Content;
import model.Tag;
import model.Video;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class TagRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public Tag create(Tag tag) {
        em.persist(tag);
        return tag;
    }

    @Transactional
    public void update(Tag tag) {}

    @Transactional
    public void delete(Long id) {
        Tag tag = getById(id);

        for (Content content : tag.getUsageList()) {
            content.removeTag(tag);
        }

        em.createQuery("delete from Tag t where t.tagId = :id")
                .setParameter("id", id)
                .executeUpdate();
    }

    @Transactional
    public List<Tag> tagsForVideo(Long videoId) {
        return em.createQuery("select t from Video v join v.tags t where v.contentId = :videoId", Tag.class)
                .setParameter("videoId", videoId)
                .getResultList();
    }

    @Transactional
    public List<Tag> getAll() {
        return em.createQuery("select t from Tag t", Tag.class)
                .getResultList();
    }

    public Tag getById(Long id){
        return em.find(Tag.class, id);
    }
}
