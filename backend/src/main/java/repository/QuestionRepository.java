package repository;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import model.AnswerOption;
import model.Question;

import java.util.List;

@ApplicationScoped
public class QuestionRepository {
    @Inject
    EntityManager em;

    @Inject
    VideoRepository videoRepository;

    @Transactional
    public void create(Long videoId, Question question) {
        question.setVideo(videoRepository.getById(videoId));
        em.persist(question);
    }

    @Transactional
    public void update(Question question) {}

    @Transactional
    public void delete(Long id) {
        em.remove(getById(id));
    }

    public List<Question> getAll(Long videoId) {
        return em.createQuery("select q from Question q where q.video.id = :videoId", Question.class)
                .setParameter("videoId", videoId).getResultList();
    }

    public Question getById(Long id){
        return em.find(Question.class, id);
    }

    @Transactional
    public void addAnswerOption(Long id, AnswerOption option) {
        option.setQuestion(getById(id));
        em.persist(option);
        getById(id).addAnswerOption(option);
    }

    @Transactional
    public void removeAnswerOption(Long id, AnswerOption option) {
        getById(id).removeAnswerOption(option);
        em.remove(option);
    }
}
