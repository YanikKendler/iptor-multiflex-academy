package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Comment;
import model.StarRating;
import repository.CommentRepository;
import repository.StarRatingRepository;

import java.util.List;

@Path("/video/{videoId: [0-9]+}/starrating")
public class StarRatingResource {
    @Inject
    StarRatingRepository repository;

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createRating(@PathParam("videoId") Long vid, StarRating s){
        try {
            repository.create(vid, s);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAll(@PathParam("videoId") Long vid){
        List<StarRating> starRatings;
        try{
            starRatings = repository.getAll(vid);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(starRatings).build();
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteRating(@PathParam("id") Long id){
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
    public Response updateRating(@PathParam("id") Long id, StarRating s){
        try{
            repository.update(s);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
