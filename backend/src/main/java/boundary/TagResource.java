package boundary;

import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import model.Tag;
import repository.TagRepository;

import java.util.List;

@Path("/tag")
public class TagResource {
    @Inject
    TagRepository repository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getTag(){
        List<Tag> tags;
        try{
            tags = repository.getAll();
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(tags).build();
    }

/*    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getForVideo(@QueryParam("videoId") Long vid){
        List<Tag> tags;
        try{
            tags = repository.tagsForVideo(vid);
        }catch (Exception ex){
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().entity(tags).build();
    }*/

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createTag(Tag tagInput){
        try {
            Tag tag = repository.create(tagInput);
            return Response.ok(tag).build();
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
    }

    @DELETE
    @Path("{id: [0-9]+}")
    public Response deleteTag(@PathParam("id") Long id){
        try{
            repository.delete(id);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateTag(Tag t){
        try{
            repository.update(t);
        } catch (Exception ex) {
            return Response.status(400).entity(ex).build();
        }
        return Response.ok().build();
    }
}
