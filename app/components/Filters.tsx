import { Fragment, type FC } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type FiltersProps = {
  clientFilter: string;
  secondaryFilter: SecondaryFilter;
  setClientFilter: (client: string) => void;
  setSecondaryFilter: (filter: SecondaryFilter) => void;
};

const Filters: FC<FiltersProps> = ({ clientFilter, secondaryFilter, setClientFilter, setSecondaryFilter }) => {
  const handleSecondaryFilterChange = (value: string) => {
    setSecondaryFilter(value as SecondaryFilter);
  };

  const resetFilters = () => {
    setClientFilter("");
    setSecondaryFilter("clientVersion");
  };

  return (
    <Fragment>
      {clientFilter && (
        <div className="flex flex-col md:flex-row justify-between items-center p-4">
          <p className="text-lg font-semibold">
            {clientFilter ? `Active client filter: ${clientFilter}` : "Select a pie slice to filter further"}
          </p>
          <div className="flex items-center">
            <Select value={secondaryFilter} onValueChange={handleSecondaryFilterChange}>
              <SelectTrigger className="border p-2 rounded mr-4 w-[250px]">
                <SelectValue placeholder="Select Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clientVersion">Client Version</SelectItem>
                <SelectItem value="os">OS</SelectItem>
                <SelectItem value="languageVersion">Language Version</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={resetFilters}>Reset Filters</Button>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Filters;
