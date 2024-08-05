package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.AnswerOption;
import model.Question;
import org.hibernate.Remove;
import repository.QuestionRepository;

import java.util.List;

@Path("/video/{videoId: [0-9]+}/question")
public class QuestionResource {
    @Inject
    QuestionRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createQuestion(@PathParam("videoId") Long vid, Question q){
        try {
            repository.create(vid, q);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("videoId") Long vid){
        List<Question> questions;
        try{
            questions = repository.getAll(vid);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(questions).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteQuestion(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Path("{id: [0-9]+}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateQuestion(@PathParam("id") Long id, Question q){
        try{
            repository.update(q);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @POST
    @Path("{id: [0-9]+}/answeroption")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response addAnswerOption(@PathParam("id") Long id, AnswerOption a){
        try{
            repository.addAnswerOption(id, a);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @DELETE
    @Path("{id: [0-9]+}/answeroption")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response removeAnswerOption(@PathParam("id") Long id, AnswerOption a){
        try{
            repository.removeAnswerOption(id, a);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
