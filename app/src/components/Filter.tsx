import React, {ChangeEvent, useEffect, useState} from "react"
import {
    Box, Button,
    Checkbox,
    Chip,
    FormControl,
    InputLabel,
    ListItemText,
    MenuItem,
    OutlinedInput,
    TextField
} from "@mui/material";
import Select from "@mui/material/Select";
import AuthorService from "../services/AuthorService";
import IAuthorData from "../types/Author";
import TagService from "../services/TagService";
import BookDataService from "../services/BookService";
import Config from "../components/Config"

const Filter = ({setBooks, setCount}: any) => {
    const initialBookState = {
        tags: [],
        authors: [],
    };

    const [params, setParams] = useState<any>(initialBookState);
    const [authors, setAuthors] = useState<Array<any>>([]);
    const [tags, setTags] = useState<Array<any>>([]);

    const retrieve = () => {
        AuthorService.getAll()
            .then((response: any) => {
                let authorsArray: { id: number; name: string; }[] = [];
                response.data.data.map((author: IAuthorData) => {
                    authorsArray.push({
                        'id': author.id,
                        'name': author.fname +' '+author.lname,
                    })
                })
                setAuthors(authorsArray);
            })
            .catch((e: Error) => {
                console.log(e);
            });

        TagService.getAll()
            .then((response: any) => {
                setTags(response.data.data);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    };

    useEffect(retrieve, []);

    const handleInputChange = (event: ChangeEvent) => {
        const {name, value} = (event.currentTarget as HTMLInputElement);

        if (value) {
            setParams({...params, [name]: value ?? null});
        } else {
            setParams((current: any) => {
                const state = {...current};
                state[name] = undefined;
                return state;
            });
        }
    };

    const handleSelectChange = (event: any) => {
        setParams({ ...params, [event.target.name]: [].slice.call(event.target.value).map(item => item) });
    };

    const save = (event: any) => {
        BookDataService.getAll(params)
            .then((response: any) => {
                setBooks(response.data.data);
                setCount(response.data.meta.total);
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    return (
       <>
           <div>Filter:</div>
           <div className="form-group">
               <TextField
                   type="text"
                   label="Year"
                   variant="standard"
                   onChange={handleInputChange}
                   name="year"
                   required
               />
           </div>
           <div className="form-group">
               <FormControl>
                   <InputLabel id="demo-multiple-chip-label">Authors</InputLabel>
                   <Select
                       labelId="demo-multiple-chip-label"
                       id="demo-multiple-chip"
                       multiple
                       name="authors"
                       value={params.authors}
                       onChange={handleSelectChange}
                       input={<OutlinedInput id="select-multiple-chip" label="Authors" />}
                       renderValue={(selected: any) => (
                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                               {authors && selected.map((authorId: any) => (
                                   <Chip key={authorId} label={authors?.find(e => e.id === authorId)?.name} />
                               ))}
                           </Box>
                       )}
                       MenuProps={Config.MenuProps}
                   >
                       {authors?.map((author) => (
                           <MenuItem key={author.id} value={author.id}>
                               <Checkbox checked={params?.authors.includes(author.id)} />
                               <ListItemText primary={author.name} />
                           </MenuItem>
                       ))}
                   </Select>
               </FormControl>
           </div>

           <div className="form-group">
               <FormControl>
                   <InputLabel id="multiple-tags-label">Tags</InputLabel>
                   <Select
                       labelId="multiple-tags-label"
                       id="multiple-tags"
                       multiple
                       name="tags"
                       value={params.tags}
                       onChange={handleSelectChange}
                       input={<OutlinedInput id="select-multiple-tag" label="Tags" />}
                       renderValue={(selected) => (
                           <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                               {tags && selected.map((tagId: any) => (
                                   <Chip key={tagId} label={tags?.find(e => e.id === tagId)?.name} />
                               ))}
                           </Box>
                       )}
                       MenuProps={Config.MenuProps}
                   >
                       {tags.map((tag) => (
                           <MenuItem key={tag.id} value={tag.id}>
                               <Checkbox checked={params.tags.includes(tag.id)} />
                               <ListItemText primary={tag.name} />
                           </MenuItem>
                       ))}
                   </Select>
               </FormControl>
           </div>

           <div className="buttonForm">
           <Button variant={"contained"} onClick={save}>
               Submit
           </Button>
           </div>
       </>
    )
}
export default Filter;